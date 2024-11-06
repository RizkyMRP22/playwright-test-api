import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getSummaryPoi, getSummaryPoiWithInvalidToken,getSummaryPoiWithoutToken } from '../../../endpoints/poi/getSummaryPoi';
import { getStorage,saveStorage } from '../../../../helpers/parsingData';
import { schemas } from '../../../schemas/poi/summaryPoi.schema';
import { validateResponseSchema } from '../../../../helpers/validateSchemas';

test.describe('Get Summary POI Endpoint', () => {
    
    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const tokenGenerate = getStorage("generateToken");
        const response = await login(request, tokenGenerate);
        const responseData = await response.json();

        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message,'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        saveStorage("generateToken", responseData.data.accessToken);
    });

    test('Positive Case:[200] Get Summary POI', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getStorage("loginToken");
        const response = await getSummaryPoi(request, loginToken);
        const responseData = await response.json();
    
        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message,'Expected message is "Berhasil menampilkan data summary POI"').toBe("Berhasil menampilkan data summary POI");
        expect(responseData.meta.source,'Expected meta.source is "MyIndibiz Assistant"').toBe("MyIndibiz Assistant");
    
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
        expect(missingKeys.length,'Expected no have missing keys').toBe(0);
        expect(unexpectedKeys.length, 'Expected no have unexpected keys').toBe(0);
    });

    test('Negative Case: [401] Get Summary POI with Invalid Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getSummaryPoiWithInvalidToken(request);
        const responseData = await response.json();

        expect(responseData.code, 'Expected response code is 401').toBe(401);
        expect(responseData.message, 'Expected message is "access token expired or in invalid format"').toBe("access token expired or in invalid format");

    });

    test('Negative Case: [401] Get Summary POI Without Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getSummaryPoiWithoutToken(request);
        const responseData = await response.json();

        expect(responseData.code, 'Expected response code is 401').toBe(401);
        expect(responseData.message, 'Expected message is "required authorization headers"').toBe("required authorization headers");

    });
});
