import { APIRequestContext, APIResponse } from '@playwright/test';

let ENDPOINT_PATH = '/business-owner/v1/hero/poi/cancel-assign-poi'

export const postCancelAssignPoi = async (request: APIRequestContext, loginToken: string, poiId: string): Promise<APIResponse> => {
    const idPoi = Number(poiId);
    const response = await request.post(ENDPOINT_PATH, {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        data: {
            "idPoi": [idPoi]
        }
    });
    return response;
};

export const postCancelAssignPoiWithInvalidToken = async (request: APIRequestContext, poiId:string): Promise<APIResponse> => {
    const idPoi = Number(poiId);
    const response = await request.post(ENDPOINT_PATH, {
        headers: {
            'Authorization': 'Bearer invalidToken'
        },
        data: {
            "idPoi": [
                idPoi
            ]
        }
    });
    return response;
};

export const postCancelAssignPoiWithoutToken = async (request: APIRequestContext, poiId:string): Promise<APIResponse> => {
    const idPoi = Number(poiId);
    const response = await request.post(ENDPOINT_PATH, {
        data: {
            "idPoi": [
                idPoi
            ]
        }
    });
    return response;
};