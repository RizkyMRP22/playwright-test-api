import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { postApprovalMGR, postApprovalMGRWithInvalidToken, postApprovalMGRWithoutToken } from '../../../endpoints/approval/postApprovalSurveyHOTD';
import { getListSurvey } from '../../../endpoints/approval/getListSurvey';
import { getPoiDetail } from '../../../endpoints/poi/getPoiDetail';

test.describe('API POST Approval Hasil Survey POI By HOTD', () => {
    test.setTimeout(60000);
    let loginToken: string;
    let poiId: string;
    let email: string;
    let nikUsers: string;
    let respondentId: string;

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const nik = '850162dummy';
        const response = await login(request, nik);
        const responseData = await response.json();

        expect.soft(response.ok(), 'Expected API response to be valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code to be 200').toBe(200);
        expect.soft(responseData.message, 'Expected message to be "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        loginToken = responseData.data.accessToken;
        email = responseData.data.email;
        nikUsers = responseData.data.nik;
    });

    test('[Positive Case:[200] Approval Hasil Survey POI By HOTD', async ({ request }: { request: APIRequestContext }) => {
        await getListSurveyStep(request);
        await getPoiDetailStep(request);
        await approveSurveyStep(request);
    });

    async function getListSurveyStep(request: APIRequestContext) {
        const payload = {
            page: 1,
            size: 10,
            sortBy: "createdDate",
        };
        const response = await getListSurvey(request, loginToken, payload);
        const responseData = await response.json();

        expect.soft(responseData.code, 'Expected response code to be 200').toBe(200);
        poiId = responseData.data[2].idPoi;
        const status = 'Proses Approval - Valid Internal';
        const validBy = 'HOTD';
        expect.soft(responseData.data[2].status[0].label, `Expected poi ${poiId} Status to match ${status}`).toBe(status);
        expect.soft(responseData.data[2].validBy, `Expected validBy to match ${validBy}`).toBe(validBy);
    }

    async function getPoiDetailStep(request: APIRequestContext) {
        const response = await getPoiDetail(request, loginToken, poiId);
        const responseData = await response.json();
        expect.soft(responseData.code, 'Expected response code to be 200').toBe(200);
        respondentId = responseData.data.respondentId;
    }

    async function approveSurveyStep(request: APIRequestContext) {
        const payload = {
            action: "valid",
            email: email,
            id: respondentId,
        };
        const response = await postApprovalMGR(request, loginToken, payload);
        const responseData = await response.json();

        expect.soft(responseData.message, `Expected POI "${poiId}" to be successfully Approve`).toBe("berhasil mengirim data");
    }

    test('Negative Case: [401] Get POI Detail with Invalid Token', async ({ request }: { request: APIRequestContext }) => {
        const payload = {
            action: "valid",
            email: email,
            id: respondentId,
        };
        const response = await postApprovalMGRWithInvalidToken(request, payload);
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
