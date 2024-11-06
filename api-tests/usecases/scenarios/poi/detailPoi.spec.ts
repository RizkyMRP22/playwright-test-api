import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../endpoints/auth/postLogin';
import { getPoiDetail, getPoiDetail404,getPoiDetailWithInvalidToken,getPoiDetailWithoutToken } from '../../endpoints/poi/getPoiDetail';
import { getStorage,saveStorage } from '../../../helpers/parsingData';

test.describe('Get Poi Detail Endpoint', () => {
    
    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const tokenGenerate = getStorage("generateToken");
        const response = await login(request, tokenGenerate);
        const responseData = await response.json();

        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message,'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        saveStorage("generateToken", responseData.data.accessToken);
    });

    test.skip('Positive Case:[200] Get POI Detail', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getStorage("loginToken");
        const response = await getPoiDetail(request, loginToken, "111");
        const responseData = await response.json();
    
        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message, 'Expected message is "Berhasil menampilkan data summary POI"').toBe("Berhasil menampilkan data summary POI");
        expect(responseData.meta.source, 'Expected meta.source is "MyIndibiz Assistant"').toBe("MyIndibiz Assistant");
    
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

    test('Negative Case: [401] Get POI Detail with Invalid Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getPoiDetailWithInvalidToken(request,"111");
        const responseData = await response.json();

        expect(response.status(), 'Expected status code is 401').toBe(401);
        expect(responseData.message, 'Expected message is "access token expired or in invalid format"').toBe("access token expired or in invalid format");
    });

    test('Negative Case: [401] Get POI Detail Without Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getPoiDetailWithoutToken(request, "111");
        const responseData = await response.json();

        expect(response.status(), 'Expected status code is 401').toBe(401);
        expect(responseData.message, 'Expected message is "required authorization headers"').toBe("required authorization headers");

    });

    test('Negative Case: [404] Get POI Detail but Not Found', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getStorage("loginToken");
        const response = await getPoiDetail404(request,loginToken, "111");
        const responseData = await response.json();

        expect(response.status(),'Expected status code is 404').toBe(404);
        expect(responseData.message, 'Expected message is "Record not found tidak ditemukan!"').toBe("Record not found tidak ditemukan!");
        expect(responseData.meta.message, 'Expected meta.message is "Data tidak ditemukan dari sumber data"').toBe("Data tidak ditemukan dari sumber data");
        expect(responseData.meta.subMessage, 'Expected meta.subMessage is "Silakan coba lagi atau hubungi helpdesk MyTEnS"').toBe("Silakan coba lagi atau hubungi helpdesk MyTEnS");

    });
});
