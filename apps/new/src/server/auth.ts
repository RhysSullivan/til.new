import {
    betterAuth
} from 'better-auth';

export const auth = betterAuth({
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        }
    },

    /** if no database is provided, the user data will be stored in memory.
     * Make sure to provide a database to persist user data **/
});