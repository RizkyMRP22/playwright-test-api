import { APIRequestContext, APIResponse } from '@playwright/test';

let ENDPOINT_PATH = '/business-owner/v1/hero/sales/list-sales'

export const getListSalesAgent = async (request: APIRequestContext, loginToken: string): Promise<APIResponse> => {

    const response = await request.get(ENDPOINT_PATH, {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        params: {
            page: '1',
            size: '10',
        }
    });
    return response;
}

export const getListSalesAgentWithInvalidToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get(ENDPOINT_PATH, {
        headers: {
            'Authorization': 'Bearer invalidToken'
        },
        params: {
            page: '1',
            size: '10',
        }
    });
    return response;
};

export const getListSalesAgentWithoutToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get(ENDPOINT_PATH);
    return response;
};

export const getListSalesAgentNotValid = async (request: APIRequestContext, loginToken: string): Promise<APIResponse> => {
    const response = await request.get(ENDPOINT_PATH, {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        params: {
            page: '1',
            size: '10',
            test: 'test'
        }
    });
    return response;
};