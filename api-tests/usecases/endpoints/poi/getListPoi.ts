import { APIRequestContext, APIResponse } from '@playwright/test';

interface Params {
    page: number;
    size: number;
    sort: string;
    status?: string;
    opportunity?: string;
    subSector?: string;
    search?: string;
    witel?: string;
    sto?: string;
    ecosystem?: string;
    source?: string;
    startDateSurvey?: Date;
    endDateSurvey?: Date;
}

export const getListPoi = async (request: APIRequestContext, loginToken: string, params: Params): Promise<APIResponse> => {

    const queryParams: { [key: string]: string | number | boolean } = {
        ...params,
        ...(params.startDateSurvey ? { startDateSurvey: params.startDateSurvey.toISOString() } : {}),
        ...(params.endDateSurvey ? { endDateSurvey: params.endDateSurvey.toISOString() } : {})
    } as { [key: string]: string | number | boolean };

    const response = await request.get('/business-owner/v1/hero/poi/list-poi', {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        params: queryParams
    });
    return response;
}

export const getListPoiWithInvalidToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get('/business-owner/v1/hero/poi/list-poi', {
        headers: {
            'Authorization': 'Bearer invalidToken'
        },
        params: {
            page: '1',
            size: '10',
            sort: 'desc'
        }
    });
    return response;
};

export const getListPoiWithoutToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get('/business-owner/v1/hero/poi/list-poi');
    return response;
};

export const getListPoiNotValid = async (request: APIRequestContext, loginToken: string): Promise<APIResponse> => {
    const response = await request.get('/business-owner/v1/hero/poi/list-poi', {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        params: {
            page: '1',
            size: '10',
            sort: 'desc',
            test: 'test'
        }
    });
    return response;
};