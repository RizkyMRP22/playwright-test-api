import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getListPoi } from '../../../endpoints/poi/getListPoi';
import { postAssignPoiHOTD, postAssignPoiHOTDWithInvalidToken, postAssignPoiHOTDWithoutToken } from '../../../endpoints/poi/postAssignPoi';
import { getStorage, saveStorage } from '../../../../helpers/parsingData';

test.describe('Post Assign POI Endpoint',{
    annotation: {
      type: 'task',
      description: 'https://telkomdds.atlassian.net/browse/MSMA-3351',
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

    test.beforeEach('Get List POI with Data Mentah', async ({ request }) => {
        const params = {
            size: 1,
            page: 10,
            sort: 'desc',
            status: 'dataMentah'
        };
        const loginToken = getStorage("loginToken");
        const responseList = await getListPoi(request, loginToken, params);
        const responseDataList = await responseList.json();

        expect.soft(responseDataList.message, `Expected success message when retrieving POI`).toBe("success");

        responseDataList.data.forEach(poi => {
            const expectedStatus = 'Data Mentah';
            expect.soft(poi.status[0].label, `Expected POI ${poi.idPoi} status to be ${expectedStatus}`).toBe(expectedStatus);
        });

        poiId = responseDataList.data[0].idPoi;
        saveStorage("poiDetail-e2e", JSON.stringify(responseDataList.data[0]));
    });

    const getData = JSON.parse(getStorage("poiDetail-e2e"))
    let dataPoi = getData.idPoi
    test(`[Positive Case:[200] Assignment POI ${dataPoi} is valid`, async ({ request } : { request: APIRequestContext }) => {
        const payload = {
            poiId,
            emailUserAgent: email,
            assignTo: "HOTD",
            assignmentType: "validasi"
        };
        const responseAssign = await postAssignPoiHOTD(request, loginToken, payload);
        const responseDataAssign = await responseAssign.json();

        expect.soft(responseDataAssign.message, `Expected POI "${poiId}" to be successfully assigned`).toBe("POI berhasil diassign");
    });

    test(`Negative Case:[400] Assignment with Invalid POI`, async ({ request } : { request: APIRequestContext }) => {
        const payload = {
            poiId: "123456",
            emailUserAgent: email,
            assignTo: "HOTD",
            assignmentType: "validasi"
        };
        const responseAssign = await postAssignPoiHOTD(request, loginToken, payload);
        const responseDataAssign = await responseAssign.json();

        expect.soft(responseDataAssign.message, `Expected POI "${poiId}": POI not found tidak ditemukan!`).toBe("POI not found tidak ditemukan!");
        expect.soft(responseDataAssign.meta.message, `Expected meta.message is Data tidak ditemukan dari sumber data`).toBe("Data tidak ditemukan dari sumber data");
        expect.soft(responseDataAssign.meta.subMessage, `Expected POI meta.subMessage is Silakan coba lagi atau hubungi helpdesk MyTEnS`).toBe("Silakan coba lagi atau hubungi helpdesk MyTEnS");
    });

    test('Negative Case: [401] Get POI Detail with Invalid Token', async ({ request }: { request: APIRequestContext }) => {
        const payload = {
            poiId: "123456",
            emailUserAgent: email,
            assignTo: "HOTD",
            assignmentType: "validasi"
        };
        const response = await postAssignPoiHOTDWithInvalidToken(request,payload);
        const responseData = await response.json();

        expect.soft(response.status(), 'Expected status code is 401').toBe(401);
        expect.soft(responseData.message, 'Expected message is "access token expired or in invalid format"').toBe("access token expired or in invalid format");
    });

    test('Negative Case: [401] Get POI Detail Without Token', async ({ request }: { request: APIRequestContext }) => {
        const payload = {
            poiId: "123456",
            emailUserAgent: email,
            assignTo: "HOTD",
            assignmentType: "validasi"
        };
        const response = await postAssignPoiHOTDWithoutToken(request, payload);
        const responseData = await response.json();

        expect.soft(response.status(), 'Expected status code is 401').toBe(401);
        expect.soft(responseData.message, 'Expected message is "required authorization headers"').toBe("required authorization headers");

    });

    test(`Negative Case:[409] Assignment with Duplicate POI`, async ({ request } : { request: APIRequestContext }) => {
        const payload = {
            poiId: "35766044",
            emailUserAgent: email,
            assignTo: "HOTD",
            assignmentType: "validasi"
        };
        const responseAssign = await postAssignPoiHOTD(request, loginToken, payload);
        const responseDataAssign = await responseAssign.json();

        expect.soft(responseDataAssign.message, `Expected POI "${payload.poiId}": POI Duplicate`).toBe("POI Duplicate");
        expect.soft(responseDataAssign.meta.message, `Expected meta.message is POI sudah pernah dibuat`).toBe("POI sudah pernah dibuat");
        expect.soft(responseDataAssign.meta.subMessage, `Expected POI meta.subMessage is Silakan coba lagi atau hubungi helpdesk MyTEnS`).toBe("Silakan coba lagi atau hubungi helpdesk MyTEnS");
    });

});