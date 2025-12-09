import test from 'node:test';
import assert from 'node:assert';
import { server } from '../apidefs.js';

test("getUserById returns the correct user", async () => {
    await server.start();

    const query = `
        query ($id: ID!) {
            getUserById(id: $id) {
                id
                forename
                surname
            }
        }
    `;
    const response = await server.executeOperation({
        query,
        variables: { id: "1" }
    });

    const user = response.body.singleResult.data.getUserById;
    assert.ok(user);
    assert.equal(user.id, '1');

    await server.stop();
});
