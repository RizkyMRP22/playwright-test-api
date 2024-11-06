import { test, expect, APIRequestContext } from '@playwright/test';
import { generateToken, generateTokenWithInvalidCredentials } from '../../../endpoints/auth/postGenerateToken';
import { saveStorage } from '../../../../helpers/parsingData';

test.describe('Generate Token Endpoint', () => {
    test('Positive Case: [200] Generate Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await generateToken(request);
        const responseData = await response.json();

        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message,'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        saveStorage("generateToken", responseData.data.accessToken);
    });

    test('Negative Case: [401] Generate Token with Invalid Client ID/Secret', async ({ request }: { request: APIRequestContext }) => {
        const response = await generateTokenWithInvalidCredentials(request);
        const responseData = await response.json();

        expect(response.status(),'Expected response code is 401').toBe(401);
        expect(responseData.message, 'Expected message is "Invalid Client Id or Client Secret"').toBe("Invalid Client Id or Client Secret");
    });
});
