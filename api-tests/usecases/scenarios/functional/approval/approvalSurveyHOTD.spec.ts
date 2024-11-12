import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { postApprovalMGR, postApprovalMGRWithInvalidToken, postApprovalMGRWithoutToken } from '../../../endpoints/approval/postApprovalSurveyHOTD';
import { getListSurvey } from '../../../endpoints/approval/getListSurvey';
import { getPoiDetail } from '../../../endpoints/poi/getPoiDetail';


test.describe('API POST Approval Hasil Survey POI By HOTD',{
    annotation: {
      type: 'task',
      description: 'https://telkomdds.atlassian.net/browse/MSMA-3351',
    },
  }, () => {
    let loginToken;
    let poiId;
    let email;
    let nikUsers;
    let respondentId

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const nik = '850162dummy'
        const response = await login(request, nik);
        const responseData = await response.json();

        expect.soft(response.ok(), 'Expected API response to be valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code to be 200').toBe(200);
        expect.soft(responseData.message, 'Expected message to be "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        loginToken = responseData.data.accessToken;
        email = responseData.data.email;
        nikUsers = responseData.data.nik;
        console.log(`Login as ${nikUsers}`);
    });

    // test.beforeEach('Get List Hasil Survey POI By HOTD', async ({ request }) => {
    //     const payload = {
    //         page:1,
    //         size:10,
    //         sortBy: "createdDate",
    //     }
    //     const response = await getListSurvey(request, loginToken, payload);
    //     const responseData = await response.json();

    //     expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
    //     expect.soft(responseData.code, 'Expected response code is 200').toBe(200);
    //     expect.soft(responseData.message, 'Expected message is "Success"').toBe("success");

    //     responseData.data.forEach((data: { poiId:any, validBy:any, status: {label: any} }) => {
    //         const status = 'Proses Approval - Valid Internal'
    //         const validBy = 'HOTD'
    //         expect.soft(data.status[0].label, `Expected Status to match ${status}}`).toBe(status);
    //         expect.soft(data.validBy, `Expected validBy to match ${validBy}}`).toBe(validBy);
    //     });
    //     poiId = responseData.data[1].poiId;
    // });

    // test.beforeEach('Get POI Detail', async ({ request }) => {
    //     const response = await getPoiDetail(request, loginToken, poiId);
    //     const responseData = await response.json();
    
    //     expect(response.ok(), 'Expected response API is valid').toBeTruthy();
    //     expect(responseData.code, 'Expected response code is 200').toBe(200);
    //     expect(responseData.data.idPoi, 'Expected POI ID Match with request').toBe(poiId);
    //     expect(responseData.message, 'Expected message is "success"').toBe("success");

    //     respondentId = responseData.data.respondentId;
    // });


    // test(`[Positive Case:[200] Approval Hasil Survey POI By HOTD`, async ({ request } : { request: APIRequestContext }) => {
    //     const payload = {
    //         action: "valid",
    //         email: email,
    //         id: respondentId,
    //     };
    //     const responseAssign = await postApprovalMGR(request, loginToken, payload);
    //     const responseDataAssign = await responseAssign.json();

    //     expect.soft(responseDataAssign.message, `Expected POI "${poiId}" to be successfully Approve`).toBe("berhasil mengirim data");
    // });

    test('Negative Case: [401] Get POI Detail with Invalid Token', async ({ request }: { request: APIRequestContext }) => {
        const payload = {
            action: "valid",
            email: email,
            id: respondentId,
        };
        const response = await postApprovalMGRWithInvalidToken(request,payload);
        const responseData = await response.json();

        expect.soft(response.status(), 'Expected status code is 401').toBe(401);
        expect.soft(responseData.message, 'Expected message is "access token expired or in invalid format"').toBe("access token expired or in invalid format");
    });

    test('Negative Case: [401] Get POI Detail Without Token', async ({ request }: { request: APIRequestContext }) => {
        const payload = {
            action: "valid",
            email: email,
            id: respondentId,
        };
        const response = await postApprovalMGRWithoutToken(request, payload);
        const responseData = await response.json();

        expect.soft(response.status(), 'Expected status code is 401').toBe(401);
        expect.soft(responseData.message, 'Expected message is "required authorization headers"').toBe("required authorization headers");

    });

});