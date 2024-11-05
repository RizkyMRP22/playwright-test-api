import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../endpoints/auth/postLogin';
import { getProfile, getProfileWithInvalidToken, getProfileWithoutToken } from '../../endpoints/auth/getProfile';
import { getTokenGenerate, getLoginToken, setLoginToken } from '../../../helpers/authTokens';

test.describe('Get Profile Endpoint', () => {
    
    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const tokenGenerate = getTokenGenerate();
        const response = await login(request, tokenGenerate);
        const responseData = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(responseData.code).toBe(200);
        expect(responseData.message).toBe("Your Request Has Been Processed");

        setLoginToken(responseData.data.accessToken);
    });

    test('Positive Case: [200] Get Profile', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getLoginToken();
        const response = await getProfile(request, loginToken);
        const responseData = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(responseData.code).toBe(200);
        expect(responseData.message).toBe("User ditemukan");
    });

    test('Negative Case: [401] Get Profile with Invalid Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getProfileWithInvalidToken(request);
        const responseData = await response.json();

        expect(response.status()).toBe(401);
        expect(responseData.message).toBe("Invalid token format");
    });

    test('Negative Case: [401] Get Profile Without Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getProfileWithoutToken(request);
        const responseData = await response.json();

        expect(response.status()).toBe(401);
        expect(responseData.message).toBe("Invalid authorization");
    });
});
