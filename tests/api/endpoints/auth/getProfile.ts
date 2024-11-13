import { APIRequestContext, APIResponse } from '@playwright/test';

// Function to get profile with a valid token
export const getProfile = async (request: APIRequestContext, loginToken: string): Promise<APIResponse> => {
    const response = await request.get('/users-management/v3/profile', {
        headers: {
            'Authorization': `Bearer ${loginToken}`
        }
    });
    return response;
};

// Negative case: Get Profile with Invalid Token
export const getProfileWithInvalidToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get('/users-management/v3/profile', {
        headers: {
            'Authorization': 'Bearer invalidToken'
        }
    });
    return response;
};

// Negative case: Get Profile without Token
export const getProfileWithoutToken = async (request: APIRequestContext): Promise<APIResponse> => {
    const response = await request.get('/users-management/v3/profile');
    return response;
};
