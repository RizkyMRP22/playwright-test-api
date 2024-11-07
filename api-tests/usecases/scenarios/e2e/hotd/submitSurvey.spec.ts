import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getListPoiWithUnvalidatedStatus } from '../../../endpoints/poi/getListPoi';
import { postAssignPoiHOTD } from '../../../endpoints/poi/postAssignPoi';
import { getPoiDetail } from '../../../endpoints/poi/getPoiDetail';
import { postSubmitSurveyPoi } from '../../../endpoints/poi/postSubmitSurvey';
import { postUploadEvidence } from '../../../endpoints/poi/postUploadEvidence';
import { getStorage, saveStorage } from '../../../../helpers/parsingData';

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

test.describe.serial('Submit Survey POI', () => {
    let loginToken;
    let poiId;

    test.beforeAll(async ({ request }) => {
        const response = await login(request);
        const responseData = await response.json();

        expect(response.ok, 'Expected API response to be valid').toBeTruthy();
        expect(responseData.code, 'Expected response code to be 200').toBe(200);
        expect(responseData.message, 'Expected message to be "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        loginToken = responseData.data.accessToken;
        saveStorage("loginToken", loginToken);
    });

    test('Get List POI with Data Mentah Filtering', async ({ request }) => {
        const loginToken = getStorage("loginToken");
        const responseList = await getListPoiWithUnvalidatedStatus(request, loginToken);
        const responseDataList = await responseList.json();

        expect(responseDataList.message, `Expected success message when retrieving POI`).toBe("success");

        responseDataList.data.forEach(poi => {
            const expectedStatus = 'Data Mentah';
            expect(poi.status[0].label, `Expected POI status to be ${expectedStatus}`).toBe(expectedStatus);
        });

        poiId = responseDataList.data[0].idPoi;
        saveStorage("poiDetail", JSON.stringify(responseDataList.data[0]));
    });

    test('Assignment POI', async ({ request }) => {
        const responseAssign = await postAssignPoiHOTD(request, loginToken, poiId);
        const responseDataAssign = await responseAssign.json();
        expect(responseDataAssign.message, `Expected POI "${poiId}" to be successfully assigned`).toBe("POI berhasil diassign");
    });

    test('Validate POI detail has status Proses Survei', async ({ request }) => {
        const responsePoiDetail = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail = await responsePoiDetail.json();
        expect(responseDataPoiDetail.data.idPoi, `Expected POI ID to match request`).toBe(poiId);
        expect(responseDataPoiDetail.data.status[0].label, `Expected POI status to be "Proses Survey"`).toBe("Proses Survey");
        await delay(10000);
    });

    test('Upload Evidence', async ({ request }: { request: APIRequestContext }) => {
        const infoPoi = JSON.parse(getStorage("poiDetail"));
        const dataPoi = infoPoi.idPoi;
        const maxRetries = 5;
        let retryCount = 0;
        let responseUploadEvidence:any;
        let responseDataUploadEvidence:any;
    
        while (retryCount < maxRetries) {
            responseUploadEvidence = await postUploadEvidence(request, getStorage("loginToken"), dataPoi);
            if (responseUploadEvidence.ok) {
                responseDataUploadEvidence = await responseUploadEvidence.json();
                expect(responseDataUploadEvidence.data.mysiisPhotoId, `Expected mysiisPhotoId to be defined`).toBeDefined();
                saveStorage("evidence-upload", JSON.stringify(responseDataUploadEvidence.data));
                break; 
            } else {
                retryCount++;
                console.log(`Retrying Upload Evidence... Attempt ${retryCount}`);
                await delay(1000); // Wait 1 second before retrying
            }
        }   
    });

    test('Submit Survey POI', async ({ request }) => {
        const infoPoi = JSON.parse(getStorage("poiDetail"));    
        const infoEvidence = JSON.parse(getStorage("evidence-upload")); 
        const payload = {
            poiId: infoPoi.idPoi,
            poiName: infoPoi.name,
            sector: infoPoi.segment.sector,
            subSector: infoPoi.segment.subSector,
            latitude: infoPoi.lat,
            longitude: infoPoi.long,
            opportunity: infoPoi.segment.opportunity,
            address: infoPoi.address,
            evidence: infoEvidence.pathUrl
        };

        const responseSubmitSurvey = await postSubmitSurveyPoi(request, loginToken, payload);
        const responseDataSubmitSurvey = await responseSubmitSurvey.json();

        console.log(responseDataSubmitSurvey)

        expect(responseSubmitSurvey.ok, 'Expected API response to be valid').toBeTruthy();
        expect(responseDataSubmitSurvey.data.respodentId, `Expected respondent ID "${responseDataSubmitSurvey.data.respodentId}" to be present`).toBeDefined();
    });
});
