import { test, expect, APIRequestContext } from '@playwright/test';
import { login, loginWithInvalidToken, loginWithInvalidCredentials,loginWithInvalidCredentials2 } from '../../endpoints/auth/postLogin';
import { getStorage, saveStorage } from '../../../../helpers/parsingData';

export async function postLogin (request: APIRequestContext) {
    const response = await login(request);
    const responseData = await response.json();
    expect(response.ok(), 'Expected response API is valid').toBeTruthy();
    expect(responseData.code, 'Expected response code is 200').toBe(200);
    expect(responseData.message, 'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

    return responseData;
    saveStorage("loginToken", responseData.data.accessToken);
}

export async function postLoginWithInvalidToken (request: APIRequestContext) {
    const response = await loginWithInvalidToken(request);
    const responseData = await response.json();

    expect(responseData.code, 'Expected response code is 401').toBe(401);
    expect(responseData.message, 'Expected message is "Basic Token is not valid!"').toBe("Basic Token is not valid!");

}

export async function postLoginWithInvalidCredentials (request: APIRequestContext) {
    const response = await loginWithInvalidCredentials(request);
    const responseData = await response.json();

    expect(responseData.code, 'Expected response code is 400').toBe(400);
    expect(responseData.message, 'Expected message is "NIK / Email / Password Salah"').toBe("NIK / Email / Password Salah");
}

export async function postLoginDisableAfter5xLoginInvalidCredentials (request: APIRequestContext) {
    for (let attempt = 1; attempt <= 3; attempt++) {
        const response = await loginWithInvalidCredentials2(request);
        const responseData = await response.json();
        
        expect(responseData.code, 'Expected response code is 400').toBe(400);
        expect(responseData.message, 'Expected message is "NIK / Email / Password Salah"').toBe("NIK / Email / Password Salah");
    }

    const response = await loginWithInvalidCredentials2(request);
    const responseData = await response.json();
    expect(responseData.code, 'Expected response code is 400').toBe(400);
    expect(responseData.message, 'Expected message is "Akun Terkunci Sementara"').toBe("Akun Terkunci Sementara");
    expect(responseData.details.eventCode, 'Expected details.eventCode is "5"').toBe(5);
    const expectedMessagePattern = /^Kamu sudah 3 kali salah memasukkan NIK\/email\/password\. Silakan coba lagi setelah \d+ detik\.$/;
    expect(responseData.details.message, `Expected details.message is "Kamu sudah 3 kali salah memasukkan NIK/email/password"`).toMatch(expectedMessagePattern);
    expect(responseData.details.counter).toBeDefined();

}