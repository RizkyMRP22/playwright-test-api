import { test, expect, APIRequestContext } from '@playwright/test';
import { generateToken } from '../../endpoints/auth/postGenerateToken';
import { login, loginWithInvalidToken, loginWithInvalidCredentials } from '../../endpoints/auth/postLogin';
import { getTokenGenerate, setTokenGenerate, setLoginToken } from '../../../helpers/authTokens';

test.describe('Login Endpoint', () => {
    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const response = await generateToken(request);
        const responseData = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(responseData.code).toBe(200);
        expect(responseData.message).toBe("Your Request Has Been Processed");

        setTokenGenerate(responseData.data.accessToken);
    });

    test('Positive Case: [200] Login', async ({ request }: { request: APIRequestContext }) => {
        const tokenGenerate = getTokenGenerate();
        const response = await login(request, tokenGenerate);
        const responseData = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(responseData.code).toBe(200);
        expect(responseData.message).toBe("Your Request Has Been Processed");

        setLoginToken(responseData.data.accessToken);
    });

    test('Negative Case: [401] Login with Invalid Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await loginWithInvalidToken(request);
        const responseData = await response.json();

        expect(response.status()).toBe(401);
        expect(responseData.message).toBe("Basic Token is not valid!");
    });

    test('Negative Case: [400] Login with Invalid Username/Password', async ({ request }: { request: APIRequestContext }) => {
        const tokenGenerate = getTokenGenerate();
        const response = await loginWithInvalidCredentials(request, tokenGenerate);
        const responseData = await response.json();

        expect(response.status()).toBe(400);
        expect(responseData.message).toBe("NIK / Email / Password Salah");
    });
});
