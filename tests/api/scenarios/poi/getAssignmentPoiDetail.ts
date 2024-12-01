import { test, expect, APIRequestContext } from '@playwright/test';
import { callAPI } from '../../../../helpers/callApi';

interface DataAPI {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    endPoint: string;
    body?: Record<string, any>;
};

export async function getAssignmentPoiDetail(
    request: APIRequestContext,
    loginToken: string,
    poiId: string
): Promise<any> {
    const dataAPI: DataAPI = {
        method: 'GET',
        endPoint: `/business-owner/v2/hero/poi/assignment/detail/${poiId}`,
    };

    const authToken: { type: 'Basic' | 'Bearer'; token?: string } = {
        type: 'Bearer',
        token: loginToken
    }
    
    try {
        const response = await callAPI(request, dataAPI, authToken);

        const responseBody = await response.json();
        expect.soft(response.ok(), 'Expected response API to be valid').toBeTruthy();

        return responseBody;
    } catch (error) {
        console.error('Failed to submit data:', error);
        throw error;
    }
}