import {
    getUsers as getAllUser,
    getUserById as getUserById,
    createUser as createUser,
    getUserDataMap,
    updateUser as updateUser,
    deleteUserById as deleteUser,
    searchUser as searchUser
} from './databases/db.js'

import { getAuthUser } from './databases/authdb.js'
import jwt from 'jsonwebtoken'

export const resolvers = {
    Query: {
        // Return all users (requires authentication)
        getAllUser: (parent, args, context) => {
            if (!context.user)
                throw new Error('Unauthorized access')
            return getAllUser()
        },

        // Return a user by ID (public access)
        getUserById: (parent, args, context) => {
            return getUserById(Number(args.id));
        },

        // Search users by forename (requires authentication)
        searchUser: (parent, args, context) => {
            if (!context.user) throw new Error('Unauthorized access')
            return searchUser(args.forename)
        }
    },

    Mutation: {
        // Create a new user (requires authentication)
        createUser: (parent, args, context) => {
            if (!context.user) throw new Error('Unauthorized access')
            const newItem = { forename: args.forename.trim(), surname: args.surname.trim() }
            const created = createUser(newItem)
            return created || newItem
        },

        // Update an existing user (requires authentication)
        updateUser: (parent, args, context) => {
            if (!context.user) throw new Error('Unauthorized access')
            const id = Number(args.id)
            const validItem = { forename: args.forename.trim(), surname: args.surname.trim() }
            const existed = updateUser(id, validItem)
            return { id, ...validItem }
        },

        // Delete a user by ID (requires authentication)
        deleteUser: (parent, args, context) => {
            if (!context.user) throw new Error('Unauthorized access')
            const id = Number(args.id)
            const ok = deleteUser(id)
            if (!ok) throw new Error('User not found for delete.')
            return ok
        },

        // Authenticate user and return JWT token
        login: (parent, args) => {
            const { username, password } = args
            const authUser = getAuthUser(username)

            // Validate credentials
            if (!authUser || authUser.password !== password)
                throw new Error('Unauthorized')

            // Generate JWT token
            const token = jwt.sign(
                { username: username },
                "my_secret_key",
                { expiresIn: '1h' }
            )

            return {
                username: username,
                access_token: token,
                token_type: "Bearer",
                expires_in: "1h"
            }
        }
    }
}
