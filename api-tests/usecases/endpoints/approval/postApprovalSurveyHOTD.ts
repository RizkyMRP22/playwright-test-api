import { APIRequestContext, APIResponse } from '@playwright/test';

interface Payload {
    action:string
    email:string
    id:string
}

const ENDPOINT_PATH = '/business-owner/v1/hero/poi/approval-poi'

export const postApprovalMGR = async (request: APIRequestContext, loginToken: string, payload: Payload): Promise<APIResponse> => {
    const idPoi = Number(payload.id);
    const response = await request.post(ENDPOINT_PATH, {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        data: {
            "action":payload.action,
            "email":payload.email,
            "id":idPoi,
        }
    });
    return response;
};

export const postApprovalMGRWithInvalidToken = async (request: APIRequestContext, payload: Payload): Promise<APIResponse> => {
    const idPoi = Number(payload.id);
    const response = await request.post(ENDPOINT_PATH, {
        headers: {
            'Authorization': 'Bearer invalidToken'
        },
        data: {
            "action":payload.action,
            "email":payload.email,
            "id":idPoi,
        }
    });
    return response;
};

export const postApprovalMGRWithoutToken = async (request: APIRequestContext, payload: Payload): Promise<APIResponse> => {
    const idPoi = Number(payload.id);
    const response = await request.post(ENDPOINT_PATH, {
        data: {
            "action":payload.action,
            "email":payload.email,
            "id":idPoi,
        }
    });
    return response;
};