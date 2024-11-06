import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getListPoiWithUnvalidatedStatus } from '../../../endpoints/poi/getListPoi';
import { postAssignPoiHOTD } from '../../../endpoints/poi/postAssignPoi';
import { getPoiDetail } from '../../../endpoints/poi/getPoiDetail';
import { postCancelAssignPoi }  from '../../../endpoints/poi/postCancelAssignPoi';
import { getStorage,saveStorage } from '../../../../helpers/parsingData';

test.describe.serial('Cancel Assignment POI', () => {

    let loginToken: string;
    let poiId: string;

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const tokenGenerate = getStorage("generateToken");
        const response = await login(request, tokenGenerate);
        const responseData = await response.json();

        expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code is 200').toBe(200);
        expect.soft(responseData.message,'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        loginToken = responseData.data.accessToken;
        saveStorage("loginToken", loginToken);
    });

    test('Get List POI with Data Mentah Filtering', async ({ request }: { request: APIRequestContext }) => {
        //Get List POI
        const loginToken = getStorage("loginToken");
        const responseList = await getListPoiWithUnvalidatedStatus(request, loginToken);
        const responseDataList = await responseList.json();
        expect(responseDataList.message,`Get info POI "${responseDataList.data[0].idPoi}"`).toBe("success");
        
        responseDataList.data.forEach((poi: { status: { label: any } }) => {
            const data = 'Data Mentah';
            expect(poi.status[0].label, `Expected status is ${data}`).toBe(data);
        });

        poiId = responseDataList.data[0].idPoi
    });

    test('Assignment POI', async ({ request }: { request: APIRequestContext }) => {
        // Assign POI
        const responseAssign = await postAssignPoiHOTD(request, loginToken ,poiId);
        const responseDataAssign = await responseAssign.json();
        expect(responseDataAssign.message, `Expected message is "${poiId}" POI berhasil diassign"`).toBe("POI berhasil diassign");
    });

    test('Validate Poi detail has status Proses Survei', async ({ request }: { request: APIRequestContext }) => {
        // Get Detail POI "Proses Survey"
        const responsePoiDetail = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail = await responsePoiDetail.json();
        expect(responseDataPoiDetail.data.idPoi, `Expected POI ID "${poiId}" Match with request`).toBe(poiId);
        expect(responseDataPoiDetail.data.status[0].label, `Expected Status POI "${poiId}" is "Proses Survey"`).toBe("Proses Survey")
    });

    test('Cancel Assignment POI', async ({ request }: { request: APIRequestContext }) => {
        //Cancel POI
        const responseCancel = await postCancelAssignPoi(request, loginToken ,poiId);
        const responseDataCancel = await responseCancel.json();
        expect(responseDataCancel.message, `Expected message is "${poiId}" POI berhasil di cancel"`).toBe("POI berhasil diassign");
    });

    test('Validate Poi detail has status Data Mentah', async ({ request }: { request: APIRequestContext }) => {
        // Get Detail POI "Data Mentah"
        const responsePoiDetail2 = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail2 = await responsePoiDetail2.json();
        expect(responseDataPoiDetail2.data.idPoi, `Expected POI ID "${poiId}" Match with request`).toBe(poiId);
        expect(responseDataPoiDetail2.data.status[0].label, `Expected Status POI "${poiId}" is "Data Mentah"`).toBe("Data Mentah");
    });

});
