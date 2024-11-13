import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getListPoi } from '../../../endpoints/poi/getListPoi';
import { getListSalesAgent } from '../../../endpoints/sales-agent/getListSalesAgent';
import { postAssignPoiWitel } from '../../../endpoints/sales-agent/postAssignPoi';

test.describe.serial('[E2E] Assign POI from PIC Witel to SA/AR', () => {
    let loginToken: string;
    let poiId: string;
    let idUserAgent: string;
    let emailAgent: string;
    let nikUsers: string;

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const nik = '990088dummy';
        const response = await login(request, nik);
        const responseData = await response.json();

        expect(response.ok(), 'Expected API response to be valid').toBeTruthy();
        expect(responseData.code, 'Expected response code to be 200').toBe(200);
        expect(responseData.message, 'Expected message to be "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        loginToken = responseData.data.accessToken;
        nikUsers = responseData.data.nik;
        console.log(`Login as ${nikUsers}`);
    });

    test('Get List POI with Data Mentah and Sales Agent', async ({ request }) => {
        const params = {
            size: 1,
            page: 10,
            sort: 'desc',
            status: 'dataMentah'
        };

        const [responseListPoi, responseListSalesAgent] = await Promise.all([
            getListPoi(request, loginToken, params),
            getListSalesAgent(request, loginToken)
        ]);

        const responseDataListPoi = await responseListPoi.json();
        const responseDataListSalesAgent = await responseListSalesAgent.json();

        expect(responseDataListPoi.message, `Expected success message when retrieving POI`).toBe("success");
        expect(responseDataListSalesAgent.message, `Expected success message when retrieving Sales Agent`).toBe("success");

        const poi = responseDataListPoi.data[0];
        expect(poi.status[0].label, `Expected POI ${poi.idPoi} status to be Data Mentah`).toBe('Data Mentah');

        poiId = poi.idPoi;
        idUserAgent = responseDataListSalesAgent.data[0].id;
        emailAgent = responseDataListSalesAgent.data[0].email;
    });

    test('Assignment POI by Witel to SA/AR', async ({ request }: { request: APIRequestContext }) => {
        const payload = {
            poiId,
            emailUserAgent: emailAgent,
            idUserAgent: idUserAgent,
            assignmentType: "validasi"
        };
        const responseAssign = await postAssignPoiWitel(request, loginToken, payload);
        const responseDataAssign = await responseAssign.json();

        expect(responseDataAssign.message, `Expected POI "${poiId}" to be successfully assigned to ${emailAgent}`).toBe("POI berhasil diassign");
    });
});
