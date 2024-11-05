import { APIRequestContext, APIResponse } from '@playwright/test';

// Function to get profile with a valid token
export const getListPoi = async (request: APIRequestContext, loginToken: string): Promise<APIResponse> => {
    const response = await request.get('/business-owner/v1/hero/poi/list-poi', {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        params: {
            page: '1',
            size: '10',
            sort: 'desc'
        }
    });
    return response;
};

export const getListPoiWithUnvalidatedStatus = async (request: APIRequestContext, loginToken: string): Promise<APIResponse> => {
    const response = await request.get('/business-owner/v1/hero/poi/list-poi', {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        params: {
            page: '1',
            size: '10',
            sort: 'desc',
            status: 'dataMentah'
        }
    });
    return response;
};

export const getListPoiWithValidStatus = async (request: APIRequestContext, loginToken: string): Promise<APIResponse> => {
    const response = await request.get('/business-owner/v1/hero/poi/list-poi', {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        params: {
            page: '1',
            size: '10',
            sort: 'desc',
            status: 'valid'
        }
    });
    return response;
};

export const getListPoiWithStatus = async (
    request: APIRequestContext,
    loginToken: string,
    status: string
): Promise<APIResponse> => {
    return await request.get('/business-owner/v1/hero/poi/list-poi', {
        headers: {
            Authorization: `Bearer ${loginToken}`
        },
        params: {
            page: '1',
            size: '10',
            sort: 'desc',
            status
        }
    });
};

export const getListPoiWithOpportunity = async (request: APIRequestContext, loginToken: string, opportunity:string): Promise<APIResponse> => {
    return await request.get('/business-owner/v1/hero/poi/list-poi', {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        params: {
            page: '1',
            size: '10',
            sort: 'desc',
            opportunity
        }
    });
};

export const getListPoiWithSearch = async (request: APIRequestContext, loginToken: string, search:string): Promise<APIResponse> => {
    return await request.get('/business-owner/v1/hero/poi/list-poi', {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        },
        params: {
            page: '1',
            size: '10',
            sort: 'desc',
            search
        }
    });
};

// Negative case: Get Profile with Invalid Token
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

// Negative case: Get Profile without Token
export const getListPoiWithoutToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get('/business-owner/v1/hero/poi/list-poi');
    return response;
};