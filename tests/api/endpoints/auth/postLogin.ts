import { APIRequestContext, APIResponse } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

// Function to login with valid credentials
export const login = async (request: APIRequestContext, nik?:string): Promise<APIResponse> => {
    const response = await request.post('/users-management/v3/auth/login', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.TOKEN}`
        },
        data: {
            username: nik ?? process.env.NIK,
            password: process.env.PASSWORD
        }
    });
    return response;
};

// Negative case: Login with Invalid Token
export const loginWithInvalidToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.post('/users-management/v3/auth/login', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer invalidToken'
        },
        data: {
            username: process.env.NIK,
            password: process.env.PASSWORD
        }
    });
    return response;
};

// Negative case: Login with Invalid Username/Password
export const loginWithInvalidCredentials = async (request: APIRequestContext, tokenGenerate: string): Promise<APIResponse> => {
    const response = await request.post('/users-management/v3/auth/login', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenGenerate}`
        },
        data: {
            username: process.env.NIK,
            password: "invalidPassword"
        }
    });
    return response;
};

// Negative case: Login with Invalid Username/Password
export const loginWithInvalidCredentials2 = async (request: APIRequestContext, tokenGenerate: string): Promise<APIResponse> => {
    const response = await request.post('/users-management/v3/auth/login', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenGenerate}`
        },
        data: {
            username: process.env.NIK_OTHERS,
            password: "invalidPassword"
        }
    });
    return response;
};
