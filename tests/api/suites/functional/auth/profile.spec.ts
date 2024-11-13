import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getProfile, getProfileWithInvalidToken, getProfileWithoutToken } from '../../../endpoints/auth/getProfile';
import { getStorage, saveStorage } from '../../../../../helpers/parsingData';

test.describe('API GET Profile', () => {
    
    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const response = await login(request);
        const responseData = await response.json();

        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message,'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        saveStorage("loginToken", responseData.data.accessToken);
    });

    test('Positive Case: [200] Get Profile', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getStorage("loginToken");
        const response = await getProfile(request, loginToken);
        const responseData = await response.json();

        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message,'Expected message is "User ditemukan"').toBe("User ditemukan");
    });

    test('Negative Case: [401] Get Profile with Invalid Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getProfileWithInvalidToken(request);
        const responseData = await response.json();

        expect(response.status(), 'Expected status code is 401').toBe(401);
        expect(responseData.message, 'Expected message is "Invalid token format"').toBe("Invalid token format");
    });

    test('Negative Case: [401] Get Profile Without Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getProfileWithoutToken(request);
        const responseData = await response.json();

        expect(response.status(), 'Expected status code is 401').toBe(401);
        expect(responseData.message, 'Expected message is "Invalid authorization"').toBe("Invalid authorization");
    });
});
