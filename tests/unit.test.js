import test from 'node:test';
import assert from 'node:assert';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middleware/verifytoken.js';

test('returns username when token is valid and user exists', () => {
    const token = jwt.sign({ username: 'pl' }, 'my_secret_key');
    const authHeader = `Bearer ${token}`;
    const result = verifyToken(authHeader);
    assert.strictEqual(result, 'pl');
});

test('return null when user does not exists', () => {
    const token = jwt.sign({ username: 'unknown' }, 'my_secret_key');
    const authHeader = `Bearer ${token}`;
    const result = verifyToken(authHeader);
    assert.strictEqual(result, null);
});

test('returns null for invalid signature', () => {
    const token = jwt.sign({ username: 'pl' }, 'wrong_secret_key');
    const authHeader = `Bearer ${token}`;
    const result = verifyToken(authHeader);
    assert.strictEqual(result, null);
});

test('return null for expired token', () => {
    const token = jwt.sign({ username: 'pl' }, 'my_secret_key', { expiresIn: -1 });
    const authHeader = `Bearer ${token}`;
    const result = verifyToken(authHeader);
    assert.strictEqual(result, null);
});
