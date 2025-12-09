import test from 'node:test';
import assert from 'node:assert';
import { server } from '../apidefs.js';

test('create, update, search and delete user flows', async () => {
    await server.start();

    // 1) Create a new user and verify that the returned data is valid
    const createQuery = `mutation {
        createUser(forename: "Testy", surname: "McTest") {
            id
            forename
            surname
        }
    }`;
    const createResp = await server.executeOperation(
        { query: createQuery },
        { contextValue: { user: 'pl' } }
    );
    const created = createResp.body.singleResult.data.createUser;
    assert.ok(created);
    assert.strictEqual(created.forename, 'Testy');

    // 2) Search for users whose forename matches a pattern and confirm the created user is included
    const searchQ = `query {
        searchUser(forename: "Test") {
            id
            forename
            surname
        }
    }`;
    const searchResp = await server.executeOperation(
        { query: searchQ },
        { contextValue: { user: 'pl' } }
    );
    const found = searchResp.body.singleResult.data.searchUser;
    assert.ok(Array.isArray(found));
    assert.ok(found.some(d => d.forename === 'Testy'));

    // 3) Update the previously created user and ensure the new data is returned
    const id = created.id;
    const updQ = `mutation {
        updateUser(id: ${id}, forename: "Updated", surname: "Person") {
            id
            forename
            surname
        }
    }`;
    const updResp = await server.executeOperation(
        { query: updQ },
        { contextValue: { user: 'pl' } }
    );
    const updated = updResp.body.singleResult.data.updateUser;
    assert.strictEqual(updated.forename, 'Updated');

    // 4) Delete the user and verify the delete operation reports success
    const delQ = `mutation { deleteUser(id: ${id}) }`;
    const delResp = await server.executeOperation(
        { query: delQ },
        { contextValue: { user: 'pl' } }
    );
    const ok = delResp.body.singleResult.data.deleteUser;
    assert.strictEqual(ok, true);

    await server.stop();
});
