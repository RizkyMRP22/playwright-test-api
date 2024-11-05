import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../endpoints/auth/login';
import { getSummaryPoi, getSummaryPoiWithInvalidToken,getSummaryPoiWithoutToken } from '../../endpoints/poi/getSummaryPoi';
import { getTokenGenerate, getLoginToken, setLoginToken } from '../../../helpers/authTokens';
import { schemas } from '../../schemas/poi/summaryPoi.schema';
import { validateResponseSchema } from '../../../helpers/validateSchemas';

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

    test('Positive Case:[200] Get Summary POI', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getLoginToken();
        const response = await getSummaryPoi(request, loginToken);
        const responseData = await response.json();
    
        expect(response.ok()).toBeTruthy();
        expect(responseData.code).toBe(200);  
        expect(responseData.message).toBe("Berhasil menampilkan data summary POI");
        expect(responseData.meta.source).toBe("MyIndibiz Assistant");
    
        // Expected keys in the data object
        const expectedLabels = [
            'totalPoi',
            'unvalidated',
            'assigned',
            'approvalProcess',
            'approvalProcessSubmitted',
            'approvalProcessValidMitra',
            'approvalProcessValidInternal',
            'valid',
            'invalid',
            'notFound'
        ];
    
        // Get actual keys from response data
        const actualKeys = Object.keys(responseData.data);
    
        const unexpectedKeys = expectedLabels.filter(label => !actualKeys.includes(label));
        const missingKeys = actualKeys.filter(key => !expectedLabels.includes(key));
        console.info("missingKeys: ",missingKeys)
        console.info("unexpectedKeys: ",unexpectedKeys)
        expect(missingKeys.length).toBe(0);
        expect(unexpectedKeys.length).toBe(0);
    });

    test('Negative Case: [401] Get Summary POI with Invalid Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getSummaryPoiWithInvalidToken(request);
        const responseData = await response.json();

        expect(response.status()).toBe(401);
        expect(responseData.message).toBe("access token expired or in invalid format");

    });

    test('Negative Case: [401] Get Summary POI Without Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getSummaryPoiWithoutToken(request);
        const responseData = await response.json();

        expect(response.status()).toBe(401);
        expect(responseData.message).toBe("required authorization headers");
    });
});
