import { test, expect, APIRequestContext } from '@playwright/test';
import { postLogin, postLoginDisableAfter5xLoginInvalidCredentials, postLoginWithInvalidCredentials, postLoginWithInvalidToken } from '../../../scenarios/auth/postLogin';

test.describe('API POST Login', () => {

    test('Positive Case: [200] Login', async ({ request }: { request: APIRequestContext }) => {
        await postLogin(request);
    });

    test('Negative Case: [401] Login with Invalid Token', async ({ request }: { request: APIRequestContext }) => {  
        await postLoginWithInvalidToken(request);
    });

    test('Negative Case: [400] Login with Invalid Username/Password', async ({ request }: { request: APIRequestContext }) => {
        await postLoginWithInvalidCredentials(request);
    });

    test('Negative Case: [400] Login disable after 5x login Invalid Username/Password', async ({ request }: { request: APIRequestContext }) => {
        await postLoginDisableAfter5xLoginInvalidCredentials(request);
    });
});
