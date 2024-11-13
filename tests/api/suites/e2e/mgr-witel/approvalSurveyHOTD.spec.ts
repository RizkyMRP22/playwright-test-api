import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { postApprovalMGR } from '../../../endpoints/approval/postApprovalSurveyHOTD';
import { getListSurvey } from '../../../endpoints/approval/getListSurvey';
import { getPoiDetail } from '../../../endpoints/poi/getPoiDetail';

test.describe.skip('API POST Approval Hasil Survey POI By HOTD', () => {


    test('Positive Case: [200] Approval Hasil Survey POI By HOTD', async ({ request }: { request: APIRequestContext }) => {
        await test.step('Login', async () => {
            await postLogin(request);
        });

        await test.step('Get List Survey', async () => { 
            await getListSurveyStep(request);
        });

        await test.step('Get POI Detail', async () => {
            await getPoiDetailStep(request);
        });

        await test.step('Approval Survey', async () => {
            await approveSurveyStep(request);   
        });
    });


});

let loginToken: string;
let poiId: string;
let email: string;
let nikUsers: string;
let respondentId: string;

async function postLogin(request: APIRequestContext) {
    const nik = '850162dummy';
    const response = await login(request,nik );
    const responseData = await response.json();

    expect.soft(response.ok(), 'Expected API response to be valid').toBeTruthy();
    expect.soft(responseData.code, 'Expected response code to be 200').toBe(200);
    expect.soft(responseData.message, 'Expected message to be "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

    loginToken = responseData.data.accessToken;
    email = responseData.data.email;
    nikUsers = responseData.data.nik;
};

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

async function approveSurveyStep(request: APIRequestContext, id?:string) {
    const payload = {
        action: "valid",
        email: email,
        id: respondentId,
        poiId: poiId,
    };
    const response = await postApprovalMGR(request, loginToken, payload);
    const responseData = await response.json();

    expect.soft(responseData.message, `Expected POI "${poiId}" to be successfully Approve`).toBe("berhasil mengirim data");
}
