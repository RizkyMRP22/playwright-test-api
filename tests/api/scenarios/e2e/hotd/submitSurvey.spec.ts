import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getListPoi } from '../../../endpoints/poi/getListPoi';
import { postAssignPoiHOTD } from '../../../endpoints/poi/postAssignPoi';
import { getPoiDetail } from '../../../endpoints/poi/getPoiDetail';
import { postSubmitSurveyPoi } from '../../../endpoints/poi/postSubmitSurvey';
import { postUploadEvidence } from '../../../endpoints/poi/postUploadEvidence';
import { getStorage, saveStorage } from '../../../../../helpers/parsingData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test.describe.serial('[E2E] Assign POI By HOTD', () => {
    let loginToken: string;
    let poiId: string;
    let email: string;
    let respondentId: string;

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const response = await login(request);
        const responseData = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(responseData.code).toBe(200);
        expect(responseData.message).toBe("Your Request Has Been Processed");

        loginToken = responseData.data.accessToken;
        email = responseData.data.email;
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

        expect(responseDataList.message).toBe("success");

        responseDataList.data.forEach(poi => {
            expect(poi.status[0].label).toBe('Data Mentah');
        });

        poiId = responseDataList.data[0].idPoi;
        saveStorage("poiDetail-e2e", JSON.stringify(responseDataList.data[0]));
    });

    test('Assignment POI', async ({ request }) => {
        const poiDetail = JSON.parse(getStorage("poiDetail-e2e"));
        const payload = {
            poiId,
            emailUserAgent: email,
            assignTo: "HOTD",
            assignmentType: "validasi"
        };
        const responseAssign = await postAssignPoiHOTD(request, loginToken, payload);
        const responseDataAssign = await responseAssign.json();

        expect(responseDataAssign.message).toBe("POI berhasil diassign");
    });

    test('Validate POI detail has status Proses Survei', async ({ request }) => {
        const responsePoiDetail = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail = await responsePoiDetail.json();

        expect(responseDataPoiDetail.data.idPoi).toBe(poiId);
        expect(responseDataPoiDetail.data.status[0].label).toBe("Proses Survey");

        await delay(5000);
    });

    test('Upload Evidence for POI', async ({ request }) => {
        await delay(2000);
        const maxRetries = 5;
        let retryCount = 0;
        let responseUploadEvidence;
        let responseDataUploadEvidence;

        while (retryCount < maxRetries) {
            responseUploadEvidence = await postUploadEvidence(request, loginToken, poiId);
            if (responseUploadEvidence.ok()) {
                responseDataUploadEvidence = await responseUploadEvidence.json();
                expect(responseDataUploadEvidence.data.mysiisPhotoId).toBeDefined();
                saveStorage("evidence-upload", JSON.stringify(responseDataUploadEvidence.data));
                break;
            } else {
                retryCount++;
                console.log(`Retrying Upload Evidence... Attempt ${retryCount}`);
                await delay(1000);
            }
        }
    });

    test('Submit Survey POI', async ({ request }) => {
        const poiDetail = JSON.parse(getStorage("poiDetail-e2e"));
        const infoEvidence = JSON.parse(getStorage("evidence-upload"));

        const payload = {
            poiId,
            poiName: poiDetail.name,
            sector: poiDetail.segment.sector,
            subSector: poiDetail.segment.subSector,
            latitude: poiDetail.lat,
            longitude: poiDetail.long,
            opportunity: poiDetail.segment.opportunity,
            address: poiDetail.address,
            evidence: infoEvidence.pathUrl
        };

        const responseSubmitSurvey = await postSubmitSurveyPoi(request, loginToken, payload);
        const responseDataSubmitSurvey = await responseSubmitSurvey.json();

        expect(responseSubmitSurvey.ok()).toBeTruthy();
        expect(responseDataSubmitSurvey.data.respodentId).toBeDefined();

        respondentId = responseDataSubmitSurvey.data.respodentId;
        saveStorage("respondentId", JSON.stringify(respondentId));
        await delay(1000);
    });

    test('Validate POI detail has status Valid Internal', async ({ request }) => {
        await delay(1000);
        const responsePoiDetail = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail = await responsePoiDetail.json();

        expect(responseDataPoiDetail.data.idPoi).toBe(poiId);
        expect(responseDataPoiDetail.data.respondentId).toBe(Number(respondentId));
        expect(responseDataPoiDetail.data.status[0].label).toBe("Proses Approval - POI Hasil Survei");
        expect(responseDataPoiDetail.data.status[1].label).toBe("Valid Internal");
    });
});
