import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getListPoi } from '../../../endpoints/poi/getListPoi';
import { postAssignPoiHOTD } from '../../../endpoints/poi/postAssignPoi';
import { getPoiDetail } from '../../../endpoints/poi/getPoiDetail';
import { postCancelAssignPoi }  from '../../../endpoints/poi/postCancelAssignPoi';
import { getStorage, saveStorage } from '../../../../../helpers/parsingData';

test.describe.serial('[E2E] Cancel Assign POI by HOTD', () => {

    let loginToken: string;
    let poiId: string;
    let nik: string;

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const response = await login(request);
        const responseData = await response.json();

        expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code is 200').toBe(200);
        expect.soft(responseData.message,'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        loginToken = responseData.data.accessToken;
        nik = responseData.data.nik;
        saveStorage("loginToken", loginToken);
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
        saveStorage("poiDetail", JSON.stringify(responseDataList.data[0]));
    });

    test('Assignment POI', async ({ request }: { request: APIRequestContext }) => {
        const payload = {
            poiId: poiId,
            emailUserAgent: nik,
            assignTo: "HOTD",
            assignmentType: "validasi"
        };

        const responseAssign = await postAssignPoiHOTD(request, loginToken, payload);
        const responseDataAssign = await responseAssign.json();
        expect.soft(responseDataAssign.message, `Expected message is "POI berhasil diassign"`).toBe("POI berhasil diassign");
    });

    test('Validate POI detail has status Proses Survei', async ({ request }: { request: APIRequestContext }) => {
        const responsePoiDetail = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail = await responsePoiDetail.json();
        expect.soft(responseDataPoiDetail.data.idPoi, `Expected POI ID "${poiId}" Match with request`).toBe(poiId);
        expect.soft(responseDataPoiDetail.data.status[0].label, `Expected Status POI "${poiId}" is "Proses Survey"`).toBe("Proses Survey");
    });

    test('Cancel Assignment POI', async ({ request }: { request: APIRequestContext }) => {
        const responseCancel = await postCancelAssignPoi(request, loginToken, poiId);
        const responseDataCancel = await responseCancel.json();
        expect.soft(responseDataCancel.message, `Expected message is "POI berhasil di cancel"`).toBe("POI berhasil di cancel");
    });

    test('Validate POI detail has status Data Mentah', async ({ request }: { request: APIRequestContext }) => {
        const responsePoiDetail2 = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail2 = await responsePoiDetail2.json();
        expect.soft(responseDataPoiDetail2.data.idPoi, `Expected POI ID "${poiId}" Match with request`).toBe(poiId);
        expect.soft(responseDataPoiDetail2.data.status[0].label, `Expected Status POI "${poiId}" is "Data Mentah"`).toBe("Data Mentah");
    });

});
