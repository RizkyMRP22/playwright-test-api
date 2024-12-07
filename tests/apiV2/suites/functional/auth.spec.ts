import { test, expect, APIRequestContext } from '@playwright/test';
import LoginCases from '../../scenarios/auth/login.cases';
import ProfileCases from '../../scenarios/auth/profile.cases';

test.describe('API POST Login', () => {
    test('Verify user can login with valid account', async ({ request }) => {
        await LoginCases.validLogin(request);
    });

    test('Verify user cant login with invalid account', async ({ request }) => {
       await LoginCases.invalidLogin(request);
    });

    test('Verify Login disable after 5x login with Invalid Username/Password', async ({ request }) => {
        await LoginCases.invalidLogin5Times(request);
    });

    test('Verify user can login with valid account (PIC WITEL)', async ({ request }) => {
        const payload = {
            username: process.env.NIK_PIC_WITEL,
            password: process.env.PASSWORD
        }
        await LoginCases.validLogin(request, payload);
    });
});

test.describe('API GET Profile', () => {

    let loginToken:string;

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const response = await LoginCases.validLogin(request);
        loginToken = response.data.accessToken
    });

    test('Verify user can get data profile', async ({ request }) => {
        await ProfileCases.getProfile(request, loginToken);
    });

    test('Verify user cant get data profile with invalid token', async ({ request }) => {
        await ProfileCases.getProfileWithInvalidToken(request);
    });
});