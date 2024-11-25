import { APIRequestContext, APIResponse } from '@playwright/test';

let ENDPOINT_PATH = `lead-management/lead/v1`

export const getLeadDetail = async (request: APIRequestContext, loginToken: string, leadId:string): Promise<APIResponse> => {

    const response = await request.get(`${ENDPOINT_PATH}/${leadId}`, {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        }
    });
    return response;
}