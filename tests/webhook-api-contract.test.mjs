import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const spec = JSON.parse(await readFile(new URL('../api-reference/openapi.json', import.meta.url), 'utf8'));
const schema = spec.paths['/v1/events'].get.parameters.find(p => p.name === 'resource_id').schema;
test('event resource filters accept real payment/session/quote-request/card IDs', () => {
  const pattern = new RegExp(schema.pattern);
  for (const id of ['sa_enrollment_example', 'card_example', 'card_00000000000000000000000000', 'txn_example', 'txn_attempt_one', 'ses_01M4RD0BV8151NN501GVD5P786', 'ses_example_one', 'qreq_0123456789abcdef0123456789abcdef', 'qreq_example_one', 'mdt_example', 'mdt_example_one']) {
    assert.ok(pattern.test(id), id);
  }
  for (const id of ['sess_example', 'qte_example', 'whe_example', 'txn_', 'ses_invalid-id', 'qreq_bad/path']) {
    assert.equal(pattern.test(id), false, id);
  }
  assert.equal(schema.maxLength, 120);
});

test('outcome APIs keep the existing public code contract without canonical_code', () => {
 const schemas=JSON.stringify(spec.components.schemas);
 assert.equal(schemas.includes('canonical_code'), false);
 for (const path of ['/v1/sessions/{sessionId}/payment-result','/v1/sessions/{sessionId}/status']) {
  assert.match(spec.paths[path].get.description,/preserved/);
  assert.match(spec.paths[path].get.description,/versioned API release/);
 }
});


test('mandate charge documents safe fixed messages rather than raw threshold diagnostics', () => {
 const source=JSON.stringify(spec.components.schemas);
 assert.equal(source.includes('e.g. THRESHOLD_EXCEEDED'),false);
 assert.match(source,/Fixed safe catalog message/);
});


test('all event selection schemas include the eighteen-event contract', () => {
 let enums=0;
 function visit(node){
  if (!node || typeof node !== 'object')return;
  if (Array.isArray(node.enum) && node.enum.includes('payment.failed')) {
   for(const event of ['card.saved','card.deleted','mandate.paused','mandate.resumed','mandate.cancelled','mandate.expired'])assert.ok(node.enum.includes(event),event);
   assert.equal(node.enum.length,18);enums++;
  }
  for(const value of Object.values(node))visit(value);
 }
 visit(spec);assert.ok(enums>=5);
});


test('card events correlate the application user even without a session', async () => {
 const events=await readFile(new URL('../webhooks/events.mdx',import.meta.url),'utf8');
 const blocks=[...events.matchAll(/```json\n([\s\S]*?)```/g)].map(m=>JSON.parse(m[1]));
 const card=blocks.find(event=>event.type==='card.saved');
 assert.equal(card.data.user_id,'user_example');
 assert.match(events,/`user_id`.*original/i);
 assert.doesNotMatch(events,/Charge transaction rows are not rewritten|linked setup attempt/);
 assert.match(spec.components.schemas.WebhookEvent.properties.data.description,/user_id/);
});
