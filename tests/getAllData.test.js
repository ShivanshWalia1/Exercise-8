import test from 'node:test';
import assert from 'node:assert';
import { server } from '../apidefs.js';
import jwt from 'jsonwebtoken';

test('getAllUser returns all users for authorized user', async () => {
    await server.start();

    const token = jwt.sign(
        { username: "testuser" },
        "my_secret_key",
        { expiresIn: "1h" }
    );
    const decoded = jwt.verify(token, "my_secret_key");

    const query = `
        query {
            getAllUser {
                id
                forename
                surname
            }
        }
    `;
    const response = await server.executeOperation(
        { query },
        { contextValue: { user: decoded.username } }
    );

    const data = response.body.singleResult.data.getAllUser;
    assert.ok(Array.isArray(data));

    await server.stop();
});
