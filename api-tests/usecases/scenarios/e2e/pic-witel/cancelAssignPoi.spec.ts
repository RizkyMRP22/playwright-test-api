import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getListPoi } from '../../../endpoints/poi/getListPoi';
import { getPoiDetail } from '../../../endpoints/poi/getPoiDetail';
import { postCancelAssignPoi }  from '../../../endpoints/poi/postCancelAssignPoi';
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
        const response = await login(request,nik);
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
    
    test(`Assignment POI by Witel to SA/AR`, async ({ request } : { request: APIRequestContext }) => {
        await test.step('Get List Sales Agent', async () => {
            const responseList = await getListSalesAgent(request, loginToken);
            const responseDataList = await responseList.json();
            expect.soft(responseDataList.message, `Expected success message when retrieving POI`).toBe("success");
    
            idUserAgent = responseDataList.data[0].id;
            emailAgent = responseDataList.data[0].email;
        });
        
        await test.step(`Assignment POI ${poiId} to ${emailAgent}`, async () => {
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
    
    test(`Cancel Assignment POI`, async ({ request }: { request: APIRequestContext }) => {
        const responseCancel = await postCancelAssignPoi(request, loginToken ,poiId);
        const responseDataCancel = await responseCancel.json();
        expect.soft(responseDataCancel.message, `Expected message is "${poiId}" POI berhasil di cancel"`).toBe("POI berhasil di cancel");
    });

    test(`Validate Poi detail has status Data Mentah`, async ({ request }: { request: APIRequestContext }) => {
        const responsePoiDetail2 = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail2 = await responsePoiDetail2.json();
        expect(responseDataPoiDetail2.data.idPoi, `Expected POI ID "${poiId}" Match with request`).toBe(poiId);
        expect(responseDataPoiDetail2.data.status[0].label, `Expected Status POI "${poiId}" is "Data Mentah"`).toBe("Data Mentah");
    });
});
