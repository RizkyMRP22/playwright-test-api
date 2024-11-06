import { APIRequestContext, APIResponse } from '@playwright/test';

export const postAssignPoiHOTD = async (request: APIRequestContext, loginToken: string, poiId: string): Promise<APIResponse> => {
    const idPoi = Number(poiId);
    const response = await request.post('/business-owner/v1/hero/poi/assign-poi', {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        data: {
            "idPoi": [
                idPoi
            ],
            "emailUserAgent": "920194dummy",
            "assignTo": "HOTD",
            "assignmentType": "validasi"
        }
    });
    return response;
};