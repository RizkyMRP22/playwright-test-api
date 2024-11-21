import { APIRequestContext, APIResponse } from '@playwright/test';

interface Params {
    page?: number;
    size?: number;
    status?: string;
    search?: string;
    sto?: string;
    ecosystem?: string;
    source?: string;
}

let ENDPOINT_PATH = '/business-owner/v2/hero/poi/assignment'

export const getListAssignment = async (request: APIRequestContext, loginToken: string, params?: Params): Promise<APIResponse> => {

    const queryParams: { [key: string]: string | number | boolean } = {
        ...params
    } as { [key: string]: string | number | boolean };

    const response = await request.get(ENDPOINT_PATH, {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        params: queryParams
    });
    return response;
}

export const getListAssignmentWithInvalidToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get(ENDPOINT_PATH, {
        headers: {
            'Authorization': 'Bearer invalidToken'
        },
        params: {
            page: '1',
            size: '10',
            sort: 'desc'
        }
    });
    return response;
};

export const getListAssignmentWithoutToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get(ENDPOINT_PATH);
    return response;
};

export const getListAssignmentNotValid = async (request: APIRequestContext, loginToken: string): Promise<APIResponse> => {
    const response = await request.get(ENDPOINT_PATH, {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        params: {
            page: '1',
            size: '10',
            sort: 'desc',
            test: 'test'
        }
    });
    return response;
};