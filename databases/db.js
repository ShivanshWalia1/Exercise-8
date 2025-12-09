var users = [
  {
    "id": 1,
    "forename": "Roy",
    "surname": "Fielding"
  },
  {
    "id": 2,
    "forename": "Tim",
    "surname": "Berners-Lee"
  },
  {
    "id": 3,
    "forename": "Jyri",
    "surname": "Kemppainen"
  }
]

let userMap = {
  jk: [1, 3],
  pl: [2]
}

export function getUserMap () {
  // simulate retrieving all user mappings from a data source
  return userMap
}

export function getUserDataMap ( username ) {
  // simulate retrieving a specific mapping for the given username
  return userMap[username]
}

export function getUsers () {
  // simulate fetching all users from a data source
  return users
}

export function getUserById ( id ) {
  // simulate fetching a single user by id
  return users.find(item => item.id === id)
}

export function createUser(newUserData) {
  // generate the next unique id (mock auto-increment)
  const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

  const newUser = { id: nextId, ...newUserData };

  // store the new user in the simulated database
  users.push(newUser);

  // return the created user record
  return newUser;
}

export function updateUser(id, user) {
  const index = users.findIndex(u => u.id === id);

  // return false if no user exists with the given id
  if (index === -1) {
    return false;
  }

  // replace the existing user with updated data
  users[index] = { id, ...user };
  return true;
}

export function deleteUserById(id) {
  const initialLength = users.length;

  // remove user entries that do not match the given id
  users = users.filter(user => user.id !== id);

  // return whether a user was actually removed
  return users.length < initialLength;
}

export function searchUser(forename) {
  // return empty result if no search term was provided
  if (!forename) return [];

  // return users whose forename matches the search query (case-insensitive)
  return users.filter(u =>
    u.forename.toLowerCase().includes(String(forename).toLowerCase())
  );
}
