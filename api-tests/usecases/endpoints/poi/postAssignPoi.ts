import { APIRequestContext, APIResponse } from '@playwright/test';

interface Payload {
    poiId: string,
    emailUserAgent: string
    assignTo: string,
    assignmentType: string
}

export const postAssignPoiHOTD = async (request: APIRequestContext, loginToken: string, payload: Payload): Promise<APIResponse> => {
    const idPoi = Number(payload.poiId);
    const response = await request.post('/business-owner/v1/hero/poi/assign-poi', {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        data: {
            "idPoi": [
                idPoi
            ],
            "emailUserAgent": payload.emailUserAgent,
            "assignTo": payload.assignTo,
            "assignmentType": payload.assignmentType
        }
    });
    return response;
};