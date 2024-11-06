import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../endpoints/auth/postLogin';
import { getListPoiWithUnvalidatedStatus } from '../../endpoints/poi/getListPoi';
import { postAssignPoiHOTD } from '../../endpoints/poi/postAssignPoi';
import { getPoiDetail } from '../../endpoints/poi/getPoiDetail';
import { postCancelAssignPoi }  from '../../endpoints/poi/postCancelAssignPoi';
import { getStorage,saveStorage } from '../../../helpers/parsingData';

test.describe('Profiling POI by HOTD', () => {

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const tokenGenerate = getStorage("generateToken");
        const response = await login(request, tokenGenerate);
        const responseData = await response.json();

        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message,'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        saveStorage("loginToken", responseData.data.accessToken);
    });

    test('Positive Case:[200] Assignment POI', async ({ request }: { request: APIRequestContext }) => {
        //Get List POI
        const loginToken = getStorage("loginToken");
        const responseList = await getListPoiWithUnvalidatedStatus(request, loginToken);
        const responseDataList = await responseList.json();
        expect(responseDataList.message,`Get info POI "${responseDataList.data[0].idPoi}"`).toBe("success");
        
        responseDataList.data.forEach((poi: { status: { label: any } }) => {
            const data = 'Data Mentah';
            expect(poi.status[0].label, `Expected status is ${data}`).toBe(data);
        });

        const poiId = responseDataList.data[0].idPoi

        // Assign POI
        const responseAssign = await postAssignPoiHOTD(request, loginToken ,poiId);
        const responseDataAssign = await responseAssign.json();
        expect(responseDataAssign.message, `Expected message is "${poiId}" POI berhasil diassign"`).toBe("POI berhasil diassign");

        // Get Detail POI
        const responsePoiDetail = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail = await responsePoiDetail.json();
        expect(responseDataPoiDetail.data.idPoi, `Expected POI ID "${poiId}" Match with request`).toBe(poiId);
        expect(responseDataPoiDetail.data.status[0].label, `Expected Status POI is "Proses Survey"`).toBe("Proses Survey");
    });

    test('Positive Case:[200] Cancel Assignment POI', async ({ request }: { request: APIRequestContext }) => {
        //Get List POI
        const loginToken = getStorage("loginToken");
        const responseList = await getListPoiWithUnvalidatedStatus(request, loginToken);
        const responseDataList = await responseList.json();
        expect(responseDataList.message,`Get info POI "${responseDataList.data[0].idPoi}"`).toBe("success");
        
        responseDataList.data.forEach((poi: { status: { label: any } }) => {
            const data = 'Data Mentah';
            expect(poi.status[0].label, `Expected status is ${data}`).toBe(data);
        });

        const poiId = responseDataList.data[0].idPoi

        // Assign POI
        const responseAssign = await postAssignPoiHOTD(request, loginToken ,poiId);
        const responseDataAssign = await responseAssign.json();
        expect(responseDataAssign.message, `Expected message is "${poiId}" POI berhasil diassign"`).toBe("POI berhasil diassign");

        // Get Detail POI "Proses Survey"
        const responsePoiDetail = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail = await responsePoiDetail.json();
        expect(responseDataPoiDetail.data.idPoi, `Expected POI ID "${poiId}" Match with request`).toBe(poiId);
        expect(responseDataPoiDetail.data.status[0].label, `Expected Status POI "${poiId}" is "Proses Survey"`).toBe("Proses Survey");

        //Cancel POI
        const responseCancel = await postCancelAssignPoi(request, loginToken ,poiId);
        const responseDataCancel = await responseCancel.json();
        expect(responseDataCancel.message, `Expected message is "${poiId}" POI berhasil di cancel"`).toBe("POI berhasil diassign");

        // Get Detail POI "Data Mentah"
        const responsePoiDetail2 = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail2 = await responsePoiDetail2.json();
        expect(responseDataPoiDetail2.data.idPoi, `Expected POI ID "${poiId}" Match with request`).toBe(poiId);
        expect(responseDataPoiDetail2.data.status[0].label, `Expected Status POI "${poiId}" is "Data Mentah"`).toBe("Data Mentah");
    });

    
});
