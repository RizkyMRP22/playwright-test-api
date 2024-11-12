import { APIRequestContext, APIResponse } from '@playwright/test';

interface Payload {
    poiId: string,
    emailUserAgent: string
    idUserAgent: string,
    assignmentType: string
}

const ENDPOINT_PATH = '/business-owner/v1/hero/poi/assign-poi'

export const postAssignPoiWitel = async (request: APIRequestContext, loginToken: string, payload: Payload): Promise<APIResponse> => {
    const idPoi = Number(payload.poiId);
    const response = await request.post(ENDPOINT_PATH, {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        data: {
            "idPoi": [
                idPoi
            ],
            "emailUserAgent": payload.emailUserAgent,
            "idUserAgent": payload.idUserAgent,
            "assignmentType": payload.assignmentType
        }
    });
    return response;
};

export const postAssignPoiWitelWithInvalidToken = async (request: APIRequestContext, payload:Payload): Promise<APIResponse> => {
    const idPoi = Number(payload.poiId);
    const response = await request.post(ENDPOINT_PATH, {
        headers: {
            'Authorization': 'Bearer invalidToken'
        },
        data: {
            "idPoi": [
                idPoi
            ],
            "emailUserAgent": payload.emailUserAgent,
            "idUserAgent": payload.idUserAgent,
            "assignmentType": payload.assignmentType
        }
    });
    return response;
};

export const postAssignPoiWitelWithoutToken = async (request: APIRequestContext, payload:Payload): Promise<APIResponse> => {
    const idPoi = Number(payload.poiId);
    const response = await request.post(ENDPOINT_PATH, {
        data: {
            "idPoi": [
                idPoi
            ],
            "emailUserAgent": payload.emailUserAgent,
            "idUserAgent": payload.idUserAgent,
            "assignmentType": payload.assignmentType
        }
    });
    return response;
};