import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseAPI, DataAPI } from '../../../helpers/baseApi';
import dotenv from 'dotenv';
dotenv.config();

export interface IAuth {
    username?: string;
    password?: string;
}

/**
 * AuthEndpoints class to handle user authentication and related APIs.
 */
export class AuthEndpoints extends BaseAPI {
    /**
     * Generates a token using client credentials.
     * @param request - Playwright's APIRequestContext
     * @returns APIResponse with the generated token
     */
    static async generateToken(request: APIRequestContext): Promise<APIResponse> {
        return this.callAPI(request, {
            method: 'POST',
            endPoint: '/users-management/v3/auth/generatetoken',
            body: {
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
            },
        });
    }

    /**
     * Logs in the user using credentials.
     * @param request - Playwright's APIRequestContext
     * @param auth - Optional authentication object
     * @returns APIResponse with the login details
     */
    static async postLogin(
        request: APIRequestContext,
        auth?: IAuth
    ): Promise<APIResponse> {
        const body = {
            username: auth?.username ?? process.env.NIK,
            password: auth?.password ?? process.env.PASSWORD,
        };

        return this.callAPI(
            request,
            {
                method: 'POST',
                endPoint: '/users-management/v3/auth/login',
                body,
            },
            {
                type: 'Bearer',
                token: process.env.TOKEN,
            }
        );
    }

    /**
     * Fetches the profile of the authenticated user.
     * @param request - Playwright's APIRequestContext
     * @param loginToken - Token from the login response
     * @returns APIResponse with the user's profile
     */
    static async getProfile(
        request: APIRequestContext,
        loginToken: string
    ): Promise<APIResponse> {
        return this.callAPI(
            request,
            {
                method: 'GET',
                endPoint: '/users-management/v3/profile',
            },
            {
                type: 'Bearer',
                token: loginToken,
            }
        );
    }
}
