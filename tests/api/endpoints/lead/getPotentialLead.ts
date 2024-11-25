import { APIRequestContext, APIResponse } from '@playwright/test';

let ENDPOINT_PATH = `/opportunities/project/v2/lead`

export const getPotentialLead = async (request: APIRequestContext, loginToken: string): Promise<APIResponse> => {

    const response = await request.get(`${ENDPOINT_PATH}`, {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        params:{
            page:1,
            size:10
        }
    });
    return response;
}