import { APIRequestContext, APIResponse } from '@playwright/test';

export interface DataAPI {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    endPoint: string;
    body?: Record<string, any>;
}

export interface Auth {
    type: 'Bearer' | 'Basic';
    token?: string;
}

/**
 * BaseAPI class to standardize API requests.
 */
export class BaseAPI {
    /**
     * A static method to make API calls.
     * @param request - Playwright's APIRequestContext
     * @param dataAPI - The API details such as method, endpoint, and body
     * @param auth - Optional authorization details
     * @returns The API response as a Promise
     */
    static async callAPI(
        request: APIRequestContext,
        dataAPI: DataAPI,
        auth?: Auth
    ): Promise<APIResponse> {
        const { method, endPoint, body } = dataAPI;

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(auth?.type && auth?.token ? { Authorization: `${auth.type} ${auth.token}` } : {}),
        };

        try {
            switch (method) {
                case 'POST':
                case 'PUT':
                case 'PATCH':
                    return await request[method.toLowerCase() as 'post' | 'put' | 'patch'](endPoint, {
                        headers,
                        data: body,
                    });

                case 'GET':
                    return await request.get(endPoint, {
                        headers,
                        params: body,
                    });

                case 'DELETE':
                    return await request.delete(endPoint, {
                        headers,
                        data: body,
                    });

                default:
                    throw new Error(`Unsupported HTTP method: ${method}`);
            }
        } catch (error) {
            console.error(`Error in ${method} ${endPoint}:`, error);
            throw error;
        }
    }
}
