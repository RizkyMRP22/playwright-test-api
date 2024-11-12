import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getListPoi } from '../../../endpoints/poi/getListPoi';
import { getListSalesAgent } from '../../../endpoints/sales-agent/getListSalesAgent';
import { postAssignPoiWitel } from '../../../endpoints/sales-agent/postAssignPoi';

test.describe.serial('Submit Survey POI by PIC Witel', () => {
    let loginToken;
    let poiId;
    let idUserAgent;
    let emailAgent;
    let nikUsers;

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const nik = '990088dummy'
        const response = await login(request, nik);
        const responseData = await response.json();

        expect.soft(response.ok(), 'Expected API response to be valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code to be 200').toBe(200);
        expect.soft(responseData.message, 'Expected message to be "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        loginToken = responseData.data.accessToken;
        nikUsers = responseData.data.nik;
        console.log(`Login as ${nikUsers}`);
    });

    test('Get List POI with Data Mentah', async ({ request }) => {
        const params = {
            size: 1,
            page: 10,
            sort: 'desc',
            status: 'dataMentah'
        };
        const responseList = await getListPoi(request, loginToken, params);
        const responseDataList = await responseList.json();

        expect.soft(responseDataList.message, `Expected success message when retrieving POI`).toBe("success");

        responseDataList.data.forEach(poi => {
            const expectedStatus = 'Data Mentah';
            expect.soft(poi.status[0].label, `Expected POI ${poi.idPoi} status to be ${expectedStatus}`).toBe(expectedStatus);
        });

        poiId = responseDataList.data[0].idPoi;
    });

    test('Get List Sales Agent', async ({ request }: { request: APIRequestContext }) => {
        const responseList = await getListSalesAgent(request, loginToken);
        const responseDataList = await responseList.json();
        expect.soft(responseDataList.message, `Expected success message when retrieving POI`).toBe("success");

        idUserAgent = responseDataList.data[0].id;
        emailAgent = responseDataList.data[0].email;
    });

    test(`Assignment POI by Witel to SA/AR`, async ({ request }: { request: APIRequestContext }) => {
        const payload = {
            poiId,
            emailUserAgent: emailAgent,
            idUserAgent: idUserAgent,
            assignmentType: "validasi"
        };
        const responseAssign = await postAssignPoiWitel(request, loginToken, payload);
        const responseDataAssign = await responseAssign.json();

        expect.soft(responseDataAssign.message, `Expected POI "${poiId}" to be successfully assigned to ${emailAgent}`).toBe("POI berhasil diassign");
    });
});
