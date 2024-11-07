import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getListPoiWithUnvalidatedStatus } from '../../../endpoints/poi/getListPoi';
import { postAssignPoiHOTD } from '../../../endpoints/poi/postAssignPoi';
import { getPoiDetail } from '../../../endpoints/poi/getPoiDetail';
import { postSubmitSurveyPoi } from '../../../endpoints/poi/postSubmitSurvey';
import { getStorage, saveStorage } from '../../../../helpers/parsingData';
import { info } from 'console';

test.describe.serial('Submit Survey POI', () => {
    let loginToken: string;
    let poiId: string;

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const tokenGenerate = getStorage("generateToken");
        const response = await login(request, tokenGenerate);
        const responseData = await response.json();

        expect.soft(response.ok, 'Expected response API is valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code is 200').toBe(200);
        expect.soft(responseData.message, 'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        loginToken = responseData.data.accessToken;
        saveStorage("loginToken", loginToken);
    });

    test('Get List POI with Data Mentah Filtering', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getStorage("loginToken");
        const responseList = await getListPoiWithUnvalidatedStatus(request, loginToken);
        const responseDataList = await responseList.json();

        expect.soft(responseDataList.message, `Get info POI "${responseDataList.data[0].idPoi}"`).toBe("success");

        responseDataList.data.forEach((poi: { status: { label: any } }) => {
            const data = 'Data Mentah';
            expect.soft(poi.status[0].label, `Expected status is ${data}`).toBe(data);
        });

        poiId = responseDataList.data[0].idPoi;
        // Save POI detail for later use in the survey submission
        saveStorage("poiDetail", JSON.stringify(responseDataList.data[0]));
    });

    test('Assignment POI', async ({ request }: { request: APIRequestContext }) => {
        const responseAssign = await postAssignPoiHOTD(request, loginToken, poiId);
        const responseDataAssign = await responseAssign.json();
        expect.soft(responseDataAssign.message, `Expected message is "${poiId}" POI berhasil diassign"`).toBe("POI berhasil diassign");
    });

    test('Validate POI detail has status Proses Survei', async ({ request }: { request: APIRequestContext }) => {
        const responsePoiDetail = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail = await responsePoiDetail.json();
        expect.soft(responseDataPoiDetail.data.idPoi, `Expected POI ID "${poiId}" Match with request`).toBe(poiId);
        expect.soft(responseDataPoiDetail.data.status[0].label, `Expected Status POI "${poiId}" is "Proses Survey"`).toBe("Proses Survey");
    });

    test('Submit Survey POI', async ({ request }: { request: APIRequestContext }) => {
        const infoPoi = JSON.parse(getStorage("poiDetail"));    
        // Define the payload with corrected syntax
        const payload = {
            poiId: infoPoi.idPoi,
            poiName: infoPoi.name,
            sector: infoPoi.segment.sector,
            subSector: infoPoi.segment.subSector,
            latitude: infoPoi.lat,
            longitude: infoPoi.long,
            opportunity: infoPoi.segment.opportunity,
            address: infoPoi.address
        };

        console.log("Payload: ",payload)
    
        // Use the payload instead of infoPoi when submitting the survey
        const responseSubmitSurvey = await postSubmitSurveyPoi(request, loginToken, payload);
        const responseDataSubmitSurvey = await responseSubmitSurvey.json();
        console.log("response: ",responseDataSubmitSurvey);
    
        // Validate the response
        expect.soft(responseSubmitSurvey.ok, 'Expected response to be valid').toBeTruthy();
        expect.soft(responseDataSubmitSurvey.data.respondentId, 'Expected respondent ID to be present').toBeTruthy();
    });
    
});
