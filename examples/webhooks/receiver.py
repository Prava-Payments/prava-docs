"""Python 3, standard library only. Terminate public HTTPS in your reverse proxy."""
import hashlib
import hmac
import json
import os
import re
import sqlite3
import time
from http.server import BaseHTTPRequestHandler, HTTPServer


def verify(raw, header, secrets, now=None):
    if not isinstance(header, str) or len(header) > 1024:
        return False
    parts = [part.strip() for part in header.split(',')]
    timestamps = [part for part in parts if part.startswith('t=')]
    if len(timestamps) != 1 or not re.fullmatch(r't=\d{1,16}', timestamps[0]):
        return False
    timestamp = timestamps[0][2:]
    if abs((time.time() if now is None else now) - int(timestamp)) > 300:
        return False
    signatures = [part[3:] for part in parts if re.fullmatch(r'v1=[0-9a-f]{64}', part)][:4]
    return any(hmac.compare_digest(hmac.new(secret.encode(), timestamp.encode() + b'.' + raw, hashlib.sha256).hexdigest(), candidate) for secret in secrets for candidate in signatures)


class Receiver(BaseHTTPRequestHandler):
    def log_message(self, *_args):
        pass  # Never log request bodies, signatures or secrets.

    def do_POST(self):
        self.connection.settimeout(10)
        status, response = 503, {}
        try:
            if self.path != '/webhooks':
                status = 404
            else:
                length = int(self.headers.get('Content-Length', '0'))
                if not 0 < length <= 65536 or self.headers.get('Transfer-Encoding'):
                    status = 400
                else:
                    raw = self.rfile.read(length)
                    with open(os.environ['WEBHOOK_CONFIG_PATH'], encoding='utf-8') as file:
                        config = json.load(file)
                    if not verify(raw, self.headers.get('Prava-Signature'), config['secrets']):
                        status = 401
                    else:
                        event = json.loads(raw)
                        if event['account_id'] != config['account_id'] or event['environment'] != config['environment']:
                            status = 400
                        elif event['type'] == 'webhook.endpoint_verification':
                            status, response = 200, {'challenge': event['challenge']}
                        elif not isinstance(event.get('id'), str) or not re.fullmatch(r'evt_[A-Za-z0-9_]+', event['id']) or not isinstance(event.get('resource', {}).get('version'), int):
                            status = 400
                        else:
                            with sqlite3.connect(os.getenv('WEBHOOK_INBOX_PATH', 'webhook-inbox.sqlite'), timeout=5) as db:
                                db.execute('PRAGMA synchronous=FULL')
                                db.execute('CREATE TABLE IF NOT EXISTS webhook_inbox(event_id TEXT PRIMARY KEY,payload_text TEXT NOT NULL,received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,processed_at TEXT)')
                                db.execute('INSERT OR IGNORE INTO webhook_inbox(event_id,payload_text) VALUES(?,?)', (event['id'], raw.decode()))
                            status = 204
        except Exception:
            status = 503
        body = json.dumps(response).encode() if status != 204 else b''
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == '__main__':
    HTTPServer(('127.0.0.1', int(os.getenv('PORT', '8787'))), Receiver).serve_forever()
