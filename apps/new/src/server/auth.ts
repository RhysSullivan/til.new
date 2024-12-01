import {
    betterAuth
} from 'better-auth';
import Database from "better-sqlite3";

export type ProviderAccount = {
    id: string;
    accountId: string;
    providerId: string;
    userId: string;
    accessToken: string;
    refreshToken: string | null;
    idToken: string | null;
    accessTokenExpiresAt: string | null;
    refreshTokenExpiresAt: string | null;
    scope: string;
    password: string | null;
    createdAt: string;
    updatedAt: string;
  }

export const db = new Database("./sqlite.db");
export const auth = betterAuth({
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            scope: ['repo'],
        }
    },
    database: db,
    /** if no database is provided, the user data will be stored in memory.
     * Make sure to provide a database to persist user data **/
});