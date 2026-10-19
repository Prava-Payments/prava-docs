import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import assert from 'node:assert/strict';

const spec = JSON.parse(await readFile(new URL('../api-reference/openapi.json', import.meta.url), 'utf8'));
const schema = spec.paths['/v1/events'].get.parameters.find(p => p.name === 'resource_id').schema;
test('event resource filters accept real payment/session/quote-request IDs', () => {
  const pattern = new RegExp(schema.pattern);
  for (const id of ['txn_example', 'txn_attempt_one', 'ses_01M4RD0BV8151NN501GVD5P786', 'ses_example_one', 'qreq_0123456789abcdef0123456789abcdef', 'qreq_example_one']) {
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
