import { APIRequestContext, APIResponse } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

// Function to generate a token with valid credentials
export const generateToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.post('/users-management/v3/auth/generatetoken', {
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET
        }
    });
    return response;
};

// Negative case: Generate Token with Invalid Client ID/Secret
export const generateTokenWithInvalidCredentials = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.post('/users-management/v3/auth/generatetoken', {
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            clientId: 'invalidClientId',
            clientSecret: 'invalidClientSecret'
        }
    });
    return response;
};
