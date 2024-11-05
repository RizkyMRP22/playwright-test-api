import { test, expect, APIRequestContext } from '@playwright/test';
import { generateToken, generateTokenWithInvalidCredentials } from '../../endpoints/auth/postGenerateToken';
import { setTokenGenerate } from '../../../helpers/authTokens';

test.describe('Generate Token Endpoint', () => {
    test('Positive Case: [200] Generate Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await generateToken(request);
        const responseData = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(responseData.code).toBe(200);
        expect(responseData.message).toBe("Your Request Has Been Processed");

        setTokenGenerate(responseData.data.accessToken);
    });

    test('Negative Case: [401] Generate Token with Invalid Client ID/Secret', async ({ request }: { request: APIRequestContext }) => {
        const response = await generateTokenWithInvalidCredentials(request);
        const responseData = await response.json();

        expect(response.status()).toBe(401);
        expect(responseData.message).toBe("Invalid Client Id or Client Secret");
    });
});
