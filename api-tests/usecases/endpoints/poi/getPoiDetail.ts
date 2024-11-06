import { APIRequestContext, APIResponse } from '@playwright/test';

// Function to get poi detail with a valid token
export const getPoiDetail = async (request: APIRequestContext, loginToken: string, idPoi:string): Promise<APIResponse> => {
    const response = await request.get(`/business-owner/v1/hero/poi/detail-poi/${idPoi}`, {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        }
    });
    return response;
};

export const getPoiDetail404 = async (request: APIRequestContext, loginToken: string, idPoi:string): Promise<APIResponse> => {
    const response = await request.get(`/business-owner/v1/hero/poi/detail-poi/${idPoi}`, {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        }
    });
    return response;
};

export const getPoiDetailWithInvalidToken = async (request: APIRequestContext, idPoi:string): Promise<APIResponse> => {
    const response = await request.get(`/business-owner/v1/hero/poi/detail-poi/${idPoi}`, {
        headers: {
            'Authorization': 'Bearer invalidToken'
        }
    });
    return response;
};

export const getPoiDetailWithoutToken = async (request: APIRequestContext, idPoi:string): Promise<APIResponse> => {
    const response = await request.get(`/business-owner/v1/hero/poi/detail-poi/${idPoi}`);
    return response;
};