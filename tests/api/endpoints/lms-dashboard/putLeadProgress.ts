import { APIRequestContext, APIResponse } from '@playwright/test';

let ENDPOINT_PATH = `/lead-management/lead/v1/dispatch-lead-manager-witel`

export const putLeadProgress = async (request: APIRequestContext, loginToken: string, leadId:string): Promise<APIResponse> => {

    const response = await request.put(`${ENDPOINT_PATH}/${leadId}`, {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        }
    });
    return response;
}