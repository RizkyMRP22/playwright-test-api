import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getListPoi } from '../../../endpoints/poi/getListPoi';
import { postAssignPoiHOTD } from '../../../endpoints/poi/postAssignPoi';
import { postCancelAssignPoi, postCancelAssignPoiWithInvalidToken, postCancelAssignPoiWithoutToken }  from '../../../endpoints/poi/postCancelAssignPoi';
import { getStorage,saveStorage } from '../../../../helpers/parsingData';

test.describe('Post Cancel POI Endpoint',{
    annotation: {
      type: 'task',
      description: '',
    },
  }, () => {
    let loginToken;
    let poiId;
    let email;

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const response = await login(request);
        const responseData = await response.json();

        expect.soft(response.ok(), 'Expected API response to be valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code to be 200').toBe(200);
        expect.soft(responseData.message, 'Expected message to be "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        loginToken = responseData.data.accessToken;
        email = responseData.data.email;
        saveStorage("loginToken", loginToken);
    });

    test.beforeEach('Get List POI with Proses Survey', async ({ request }) => {
        const params = {
            size: 1,
            page: 10,
            sort: 'desc',
            status: 'prosesSurvei'
        };
        const loginToken = getStorage("loginToken");
        const responseList = await getListPoi(request, loginToken, params);
        const responseDataList = await responseList.json();

        expect.soft(responseDataList.message, `Expected success message when retrieving POI`).toBe("success");

        responseDataList.data.forEach(poi => {
            const expectedStatus = 'Proses Survey';
            expect.soft(poi.status[0].label, `Expected POI ${poi.idPoi} status to be ${expectedStatus}`).toBe(expectedStatus);
        });

        poiId = responseDataList.data[0].idPoi;
        saveStorage("poiDetail-e2e", JSON.stringify(responseDataList.data[0]));
    });

    test(`[Positive Case:[201] Cancel Assigment POI is valid`, async ({ request } : { request: APIRequestContext }) => {
        const responseCancel = await postCancelAssignPoi(request, loginToken ,poiId);
        const responseDataCancel = await responseCancel.json();

        expect.soft(responseDataCancel.code, `Expected response code is 201`).toBe(201)
        expect.soft(responseDataCancel.message, `Expected POI "${poiId}" to be successfully assigned`).toBe("POI berhasil diassign");
    });

    test(`Negative Case:[400] Cancel Assignment POI with Invalid POI`, async ({ request } : { request: APIRequestContext }) => {
        const poiId=  "123456"
        const responseAssign = await postCancelAssignPoi(request, loginToken, poiId);
        const responseDataAssign = await responseAssign.json();

        expect.soft(responseDataAssign.message, `Expected POI "${poiId}": POI not found tidak ditemukan!`).toBe("POI not found tidak ditemukan!");
        expect.soft(responseDataAssign.meta.message, `Expected meta.message is Data tidak ditemukan dari sumber data`).toBe("Data tidak ditemukan dari sumber data");
        expect.soft(responseDataAssign.meta.subMessage, `Expected POI meta.subMessage is Silakan coba lagi atau hubungi helpdesk MyTEnS`).toBe("Silakan coba lagi atau hubungi helpdesk MyTEnS");
    });

    test('Negative Case: [401] Cancel Assignment POI with Invalid Token', async ({ request }: { request: APIRequestContext }) => {
        const poiId=  "123456"
        const response = await postCancelAssignPoiWithInvalidToken(request,poiId);
        const responseData = await response.json();

        expect.soft(response.status(), 'Expected status code is 401').toBe(401);
        expect.soft(responseData.message, 'Expected message is "access token expired or in invalid format"').toBe("access token expired or in invalid format");
    });

    test('Negative Case: [401] Cancel Assignment POI  Without Token', async ({ request }: { request: APIRequestContext }) => {
        const poiId=  "123456"
        const response = await postCancelAssignPoiWithoutToken(request, poiId);
        const responseData = await response.json();

        expect.soft(response.status(), 'Expected status code is 401').toBe(401);
        expect.soft(responseData.message, 'Expected message is "required authorization headers"').toBe("required authorization headers");

    });

    test(`Negative Case:[409] Cancel Assignment with Duplicate POI`, async ({ request } : { request: APIRequestContext }) => {
        const poiId= "47213913"
        const responseAssign = await postCancelAssignPoi(request, loginToken, poiId);
        const responseDataAssign = await responseAssign.json();

        expect.soft(responseDataAssign.message, `Expected POI "${poiId}": POI Duplicate`).toBe("POI Duplicate");
        expect.soft(responseDataAssign.meta.message, `Expected meta.message is POI sudah pernah dicancel`).toBe("POI sudah pernah dicancel");
        expect.soft(responseDataAssign.meta.subMessage, `Expected POI meta.subMessage is Silakan coba lagi atau hubungi helpdesk MyTEnS`).toBe("Silakan coba lagi atau hubungi helpdesk MyTEnS");
    });

});