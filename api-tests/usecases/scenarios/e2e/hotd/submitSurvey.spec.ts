import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getListPoi } from '../../../endpoints/poi/getListPoi';
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
    let nik;
    let respodentId;

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const response = await login(request);
        const responseData = await response.json();

        expect(response.ok(), 'Expected API response to be valid').toBeTruthy();
        expect(responseData.code, 'Expected response code to be 200').toBe(200);
        expect(responseData.message, 'Expected message to be "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

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
        const loginToken = getStorage("loginToken");
        const responseList = await getListPoi(request, loginToken, params);
        const responseDataList = await responseList.json();

        expect(responseDataList.message, `Expected success message when retrieving POI`).toBe("success");

        responseDataList.data.forEach(poi => {
            const expectedStatus = 'Data Mentah';
            expect(poi.status[0].label, `Expected POI ${poi.idPoi} status to be ${expectedStatus}`).toBe(expectedStatus);
        });

        poiId = responseDataList.data[0].idPoi;
        saveStorage("poiDetail-e2e", JSON.stringify(responseDataList.data[0]));
    });
    
    const getData = JSON.parse(getStorage("poiDetail-e2e"))
    let dataPoi = getData.idPoi
    test(`Assignment POI ${dataPoi}`, async ({ request } : { request: APIRequestContext }) => {
        const payload = {
            poiId,
            emailUserAgent: nik,
            assignTo: "HOTD",
            assignmentType: "validasi"
        };
        const responseAssign = await postAssignPoiHOTD(request, loginToken, payload);
        const responseDataAssign = await responseAssign.json();

        expect(responseDataAssign.message, `Expected POI "${poiId}" to be successfully assigned`).toBe("POI berhasil diassign");
    });

    test(`Validate POI detail ${dataPoi} has status Proses Survei`, async ({ request }) => {
        const responsePoiDetail = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail = await responsePoiDetail.json();

        expect(responseDataPoiDetail.data.idPoi, `Expected POI ID ${poiId} to match request`).toBe(poiId);
        expect(responseDataPoiDetail.data.status[0].label, `Expected POI status to be "Proses Survey"`).toBe("Proses Survey");

        await delay(5000);
    });

    test(`Upload Evidence for POI ${dataPoi}`, async ({ request }: { request: APIRequestContext }) => {
        await delay(5000);
        const dataPoi = poiId;
        const maxRetries = 5;
        let retryCount = 0;
        let responseUploadEvidence;
        let responseDataUploadEvidence;

        while (retryCount < maxRetries) {
            responseUploadEvidence = await postUploadEvidence(request, getStorage("loginToken"), dataPoi);
            if (responseUploadEvidence.ok()) {
                responseDataUploadEvidence = await responseUploadEvidence.json();
                expect(responseDataUploadEvidence.data.mysiisPhotoId, `Expected mysiisPhotoId to be defined`).toBeDefined();
                saveStorage("evidence-upload", JSON.stringify(responseDataUploadEvidence.data));
                break;
            } else {
                retryCount++;
                console.log(`Retrying Upload Evidence... Attempt ${retryCount}`);
                await delay(1000);
            }
        }
    });

    test(`Submit Survey POI ${dataPoi}`, async ({ request }: { request: APIRequestContext }) => {
        const infoPoi = JSON.parse(getStorage("poiDetail-e2e"));
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

        expect(responseSubmitSurvey.ok(), 'Expected API response to be valid').toBeTruthy();
        expect(responseDataSubmitSurvey.data.respodentId, `Expected respondent ID "${responseDataSubmitSurvey.data.respodentId}" to be present`).toBeDefined();

        respodentId = responseDataSubmitSurvey.data.respodentId;
        saveStorage("respodentId", JSON.stringify(respodentId));
        await delay(1000);
    });

    test(`Validate POI detail ${dataPoi} has status Valid Internal`, async ({ request }) => {
        await delay(1000);
        const respodentIds = Number(respodentId);
        const responsePoiDetail = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail = await responsePoiDetail.json();

        expect(responseDataPoiDetail.data.idPoi, `Expected POI ID to match request`).toBe(poiId);
        expect(responseDataPoiDetail.data.respondentId, `Expected respodentId ${respodentIds} to match request`).toBe(respodentIds);
        expect(responseDataPoiDetail.data.status[0].label, `Expected POI status to be "Proses Approval - POI Hasil Survei"`).toBe("Proses Approval - POI Hasil Survei");
        expect(responseDataPoiDetail.data.status[1].label, `Expected POI status to be "Valid Internal"`).toBe("Valid Internal");
    });
});
