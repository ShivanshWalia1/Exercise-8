import gql from "graphql-tag";

export const typeDefs = gql`
  """
 shows a single system data item.
  includes fields for personal data used in CRUD operations.
  """
  type Data {
    id: ID!
    forename: String!
    surname: String!
  }

  """
  has returned after the user successfully logs in.
  includes an access token (JWT) and the username.
  """
  type AuthPayload {
    username: String!
    access_token: String!
  }

  """
  Queries available at the root for fetching data

  """
  type Query {
    getAllUser: [Data]
    getUserById(id: ID!): Data
    searchUser(forename: String!): [Data]
  }

  """
  Mutations available at the root for updating data or handling authentication

  """
  type Mutation {
    createUser(forename: String!, surname: String!): Data
    updateUser(id: ID!, forename: String!, surname: String!): Data
    deleteUser(id: ID!): Boolean
    login(username: String!, password: String!): AuthPayload
  }
`;
