import { FullConfig, request } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

// authTokens.ts
let tokenGenerate: string = '';
let loginToken: string = '';

// Functions to get tokens
export const getTokenGenerate = (): string => tokenGenerate;
export const getLoginToken = (): string => loginToken;

// Functions to set tokens
export const setTokenGenerate = (token: string): void => {
    tokenGenerate = token;
};

export const setLoginToken = (token: string): void => {
    loginToken = token;
};

async function globalSetup(config: FullConfig) {
    const baseURL = process.env.BASE_URL;
    if (!baseURL) {
        throw new Error("BASE_URL is not defined in environment variables.");
    }

    const url = '/users-management/v3/auth/generatetoken';

    try {
        const requestContext = await request.newContext();
        const response = await requestContext.post(`${baseURL}${url}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
            },
        });

        if (!response.ok()) {
            throw new Error(`Failed to generate token. Status: ${response.status()}`);
        }

        const body = await response.json();
        process.env.TOKEN = body.data.accessToken;

        await requestContext.dispose();
    } catch (error) {
        console.error("Error in global setup:", error);
        process.exit(1); // Exit with an error code to prevent tests from running if token generation fails
    }
}

export default globalSetup;