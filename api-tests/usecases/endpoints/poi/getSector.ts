import { APIRequestContext, APIResponse } from '@playwright/test';

const ENDPOINT_PATH = '/business-owner/v2/hero/poi/assignment/sector'

export const getSector = async (request: APIRequestContext, loginToken: string, opportunityId: number): Promise<APIResponse> => {
    const response = await request.get(ENDPOINT_PATH, {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        params: {
            opportunityId: opportunityId
        }
    });
    return response;
}

export const getSectorInvalidToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get(ENDPOINT_PATH, {
        headers: {
            'Authorization': 'Bearer invalidToken'
        }
    });
    return response;
};

export const getSectorWithoutToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get(ENDPOINT_PATH);
    return response;
};