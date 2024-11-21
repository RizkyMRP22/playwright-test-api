import { APIRequestContext, APIResponse } from '@playwright/test';

let ENDPOINT_PATH = '/users-management/v1/general/menu'

export const getMenuUser = async (request: APIRequestContext, loginToken: string): Promise<APIResponse> => {

    const response = await request.get(ENDPOINT_PATH, {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        }
    });
    return response;
}

export const getMenuUserWithInvalidToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get(ENDPOINT_PATH, {
        headers: {
            'Authorization': 'Bearer invalidToken'
        }
    });
    return response;
};

export const getMenuUserWithoutToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get(ENDPOINT_PATH);
    return response;
};