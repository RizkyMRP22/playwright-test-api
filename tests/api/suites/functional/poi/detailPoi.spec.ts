import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getPoiDetail, getPoiDetail404,getPoiDetailWithInvalidToken,getPoiDetailWithoutToken } from '../../../endpoints/poi/getPoiDetail';
import { getStorage, saveStorage, testActionInfo } from '../../../../../helpers/parsingData';
import { getListPoi } from '../../../endpoints/poi/getListPoi';
import { expectedStatus } from '../../../../../helpers/constants';

test.describe('API GET Poi Detail', () => {
    
    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const response = await login(request);
        const responseData = await response.json();

        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message,'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        saveStorage("loginToken", responseData.data.accessToken);
    });

    test('Positive Case:[200] Get POI Detail', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getStorage("loginToken");
        const poiId = getStorage("poiId");
        const response = await getPoiDetail(request, loginToken, poiId);
        const responseData = await response.json();
    
        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.data.idPoi, 'Expected POI ID Match with request').toBe(poiId);
        expect(responseData.message, 'Expected message is "success"').toBe("success");
        const { actionInfo } = responseData.data;
        testActionInfo(actionInfo);        
    });

    test('Positive Case:[200] Verify action button Get POI Detail is valid', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getStorage('loginToken');
      
        for (const status of expectedStatus) {
          await test.step(`Verify POI for status: ${status.key}`, async () => {
            const params = {
              page: 1,
              size: 10,
              sort: 'desc',
              status: status.key,
            };
      
            // Fetch POI list
            const responseList = await getListPoi(request, loginToken, params);
            const responseListData = await responseList.json();
      
            // Ensure at least one POI exists for the given status
            const dataPoi = responseListData.data[0]?.idPoi;
            if (!dataPoi) {
              throw new Error(`No POI found for status: ${status.key}`);
            }
      
            // Fetch POI details
            const response = await getPoiDetail(request, loginToken, dataPoi);
            const responseData = await response.json();
      
            // Assertions
            expect.soft(responseData.data.idPoi, `Expected POI ${dataPoi} to match the status ${params.status}`).toBe(dataPoi);
      
            const { actionInfo } = responseData.data;
      
            // Test actionInfo, handling empty action appropriately
            testActionInfo(actionInfo);
          });
        }
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
