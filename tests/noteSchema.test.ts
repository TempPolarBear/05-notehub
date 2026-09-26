import assert from 'node:assert/strict';
import { test } from 'node:test';
import { noteSchema } from '../src/components/NoteForm/noteSchema.ts';

const validNote = { title: 'New note', content: '', tag: 'Todo' };

test('title is required and must contain 3–50 characters', async () => {
  for (const title of ['', 'ab', 'a'.repeat(51)]) {
    assert.equal(await noteSchema.isValid({ ...validNote, title }), false);
  }
  for (const title of ['abc', 'a'.repeat(50)]) {
    assert.equal(await noteSchema.isValid({ ...validNote, title }), true);
  }
});

test('content accepts empty text and 500 characters but rejects 501', async () => {
  assert.equal(await noteSchema.isValid(validNote), true);
  assert.equal(
    await noteSchema.isValid({ ...validNote, content: 'a'.repeat(500) }),
    true,
  );
  assert.equal(
    await noteSchema.isValid({ ...validNote, content: 'a'.repeat(501) }),
    false,
  );
});

test('only the five supported tags are accepted', async () => {
  for (const tag of ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']) {
    assert.equal(await noteSchema.isValid({ ...validNote, tag }), true);
  }
  for (const tag of ['', undefined, null, 'Invalid', 'todo']) {
    assert.equal(await noteSchema.isValid({ ...validNote, tag }), false);
  }
});
