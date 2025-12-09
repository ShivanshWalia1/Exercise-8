import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./typedefs.js";
import { resolvers } from "./resolvers.js";

export const server = new ApolloServer({
    typeDefs,
    resolvers
});
