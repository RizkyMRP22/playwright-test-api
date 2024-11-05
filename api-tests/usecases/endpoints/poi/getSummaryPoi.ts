import { APIRequestContext, APIResponse } from '@playwright/test';

// Function to get profile with a valid token
export const getSummaryPoi = async (request: APIRequestContext, loginToken: string): Promise<APIResponse> => {
    const response = await request.get('/business-owner/v2/hero/poi/summary-poi', {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        }
    });
    return response;
};

// Negative case: Get Profile with Invalid Token
export const getSummaryPoiWithInvalidToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get('/business-owner/v2/hero/poi/summary-poi', {
        headers: {
            'Authorization': 'Bearer invalidToken'
        }
    });
    return response;
};

// Negative case: Get Profile without Token
export const getSummaryPoiWithoutToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get('/business-owner/v2/hero/poi/summary-poi');
    return response;
};