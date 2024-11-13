import { test, expect, APIRequestContext } from '@playwright/test';
import { generateToken } from '../../../endpoints/auth/postGenerateToken';
import { login, loginWithInvalidToken, loginWithInvalidCredentials,loginWithInvalidCredentials2 } from '../../../endpoints/auth/postLogin';
import { getStorage, saveStorage } from '../../../../../helpers/parsingData';

test.describe('API POST Login', () => {
    test.beforeAll('Positive Case: [200] Generate Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await generateToken(request);
        const responseData = await response.json();

        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message,'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        saveStorage("generateToken", responseData.data.accessToken);
    });

    test('Positive Case: [200] Login', async ({ request }: { request: APIRequestContext }) => {
        const response = await login(request);
        const responseData = await response.json();
        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message, 'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        saveStorage("loginToken", responseData.data.accessToken);
    });

    test('Negative Case: [401] Login with Invalid Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await loginWithInvalidToken(request);
        const responseData = await response.json();

        expect(responseData.code, 'Expected response code is 401').toBe(401);
        expect(responseData.message, 'Expected message is "Basic Token is not valid!"').toBe("Basic Token is not valid!");

    });

    test('Negative Case: [400] Login with Invalid Username/Password', async ({ request }: { request: APIRequestContext }) => {
        const tokenGenerate = getStorage("generateToken");
        const response = await loginWithInvalidCredentials(request, tokenGenerate);
        const responseData = await response.json();

        expect(responseData.code, 'Expected response code is 400').toBe(400);
        expect(responseData.message, 'Expected message is "NIK / Email / Password Salah"').toBe("NIK / Email / Password Salah");
    });

    test('Negative Case: [400] Login disable after 5x login Invalid Username/Password', async ({ request }: { request: APIRequestContext }) => {
        const tokenGenerate = getStorage("generateToken");

        for (let attempt = 1; attempt <= 3; attempt++) {
            const response = await loginWithInvalidCredentials2(request, tokenGenerate);
            const responseData = await response.json();
            
            expect(responseData.code, 'Expected response code is 400').toBe(400);
            expect(responseData.message, 'Expected message is "NIK / Email / Password Salah"').toBe("NIK / Email / Password Salah");
        }

        const response = await loginWithInvalidCredentials2(request, tokenGenerate);
        const responseData = await response.json();
        expect(responseData.code, 'Expected response code is 400').toBe(400);
        expect(responseData.message, 'Expected message is "Akun Terkunci Sementara"').toBe("Akun Terkunci Sementara");
        expect(responseData.details.eventCode, 'Expected details.eventCode is "5"').toBe(5);
        const expectedMessagePattern = /^Kamu sudah 3 kali salah memasukkan NIK\/email\/password\. Silakan coba lagi setelah \d+ detik\.$/;
        expect(responseData.details.message, `Expected details.message is "Kamu sudah 3 kali salah memasukkan NIK/email/password"`).toMatch(expectedMessagePattern);
        expect(responseData.details.counter).toBeDefined();
    });
});
