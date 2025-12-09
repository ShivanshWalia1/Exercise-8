// schema.js
import gql from "graphql-tag";

/**
 * GraphQL schema definitions used for this project.
 * Defines types, queries, and mutations exposed by the API.
 */
export const typeDefs = gql`
  """
  Represents an individual record in the database.
  Stores basic identifying information.
  """
  type Data {
    id: ID!
    forename: String!
    surname: String!
  }

  """
  Returned after a successful login attempt.
  Includes the user's name and a JWT access token.
  """
  type AuthPayload {
    username: String!
    access_token: String!
  }

  """
  Queries available for fetching data from the system.
  """
  type Query {
    getAllData: [Data]
    getDataById(id: ID!): Data
    searchData(query: String!): [Data]
  }

  """
  Mutations used to modify data or authenticate a user.
  """
  type Mutation {
    createData(forename: String!, surname: String!): Data
    updateData(id: ID!, forename: String!, surname: String!): Data
    deleteData(id: ID!): Boolean
    login(username: String!, password: String!): AuthPayload
  }
`;

export default typeDefs;
