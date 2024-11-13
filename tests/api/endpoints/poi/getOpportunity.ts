import { APIRequestContext, APIResponse } from '@playwright/test';

const ENDPOINT_PATH = '/business-owner/v2/hero/poi/assignment/opportunity'

export const getOpportunity = async (request: APIRequestContext, loginToken: string): Promise<APIResponse> => {

    const response = await request.get(ENDPOINT_PATH, {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        }
    });
    return response;
}

export const getOpportunityInvalidToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get(ENDPOINT_PATH, {
        headers: {
            'Authorization': 'Bearer invalidToken'
        }
    });
    return response;
};

export const getOpportunityWithoutToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get(ENDPOINT_PATH);
    return response;
};