import { APIRequestContext, APIResponse } from '@playwright/test';

let ENDPOINT_PATH = '/business-owner/v2/dashboard/menu'

export const getMenuBO = async (request: APIRequestContext, loginToken: string): Promise<APIResponse> => {

    const response = await request.get(ENDPOINT_PATH, {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        }
    });
    return response;
}

export const getMenuBOWithInvalidToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get(ENDPOINT_PATH, {
        headers: {
            'Authorization': 'Bearer invalidToken'
        }
    });
    return response;
};

export const getMenuBOWithoutToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get(ENDPOINT_PATH);
    return response;
};