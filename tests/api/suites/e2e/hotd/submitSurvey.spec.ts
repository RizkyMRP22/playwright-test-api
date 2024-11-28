import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { approveSurveyStep } from '../../../scenarios/approval/postApprovalSurvey.ts';
import { getListPoi } from '../../../endpoints/poi/getListPoi';
import { getPoiDetail } from '../../../endpoints/poi/getPoiDetail';
import { getSummaryPoi } from '../../../endpoints/poi/getSummaryPoi';
import { getListSurvey } from '../../../endpoints/approval/getListSurvey';
import { postAssignPoiHOTD } from '../../../endpoints/poi/postAssignPoi';
import { postSubmitSurveyPoi } from '../../../endpoints/poi/postSubmitSurvey';
import { postUploadEvidence } from '../../../endpoints/poi/postUploadEvidence';
import { getStorage, saveStorage } from '../../../../../helpers/parsingData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test.describe.serial('[E2E] Profiling POI By HOTD', () => {
    let loginToken: string;
    let loginTokenMGR: string;
    let poiId: string;
    let email: string;
    let respondentId: string;
    interface SummaryPoi {
        unvalidated: number;
        assigned: number;
        approvalProcessValidInternal: number;
        valid: number;
    }

    let summaryPoi: SummaryPoi;

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const response = await login(request);
        const responseData = await response.json();

        expect.soft(response.ok()).toBeTruthy();
        expect.soft(responseData.code).toBe(200);
        expect.soft(responseData.message).toBe("Your Request Has Been Processed");

        loginToken = responseData.data.accessToken;
        email = responseData.data.email;
    });

    test('Get Summary POI', async ({ request }: { request: APIRequestContext }) => {
        const nik = 'dummy-hotd';
        const loginResponse = await login(request, nik);
        const responseDataLogin = await loginResponse.json();
        loginToken = responseDataLogin.data.accessToken;

        const response = await getSummaryPoi(request, loginToken);
        expect.soft(response.ok(), 'Expected response API to be valid').toBeTruthy();
        const responseData = await response.json();
        summaryPoi = responseData.data;
        console.log(summaryPoi)
    });

    test('Get List POI with Data Mentah', async ({ request }: { request: APIRequestContext }) => {
        const params = {
            page: 1,
            size: 10,
            sort: "desc",
            status: "dataMentah"
        };

        const response = await getListPoi(request, loginToken, params);
        const responseData = await response.json();
        expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
        if (responseData.data.length > 1) {
            const randomIndex = Math.floor(Math.random() * responseData.data.length);
            const selectedPoi = responseData.data[randomIndex];
            poiId = selectedPoi.idPoi;
            console.log(`Randomly selected POI ID: ${selectedPoi.idPoi} random index ${randomIndex}`);
        } else {
            console.warn('Expected more than 1 record but got:', responseData.data.length);
        }
    }); ``

    test('Assignment POI', async ({ request }) => {
        if (!poiId) {
            throw new Error('POI ID is not available. Ensure the previous test ran successfully.');
        }

        const payload = {
            poiId,
            emailUserAgent: email,
            assignTo: 'HOTD',
            assignmentType: 'validasi',
        };

        console.log('Assignment Payload:', payload);

        const responseAssign = await postAssignPoiHOTD(request, loginToken, payload);
        const responseDataAssign = await responseAssign.json();
        expect.soft(responseDataAssign.message, 'Expected Message POI berhasil diassign').toBe('POI berhasil diassign');
    });

    test('[FIX] Get Summary POI - After Assignment POI', async ({ request }: { request: APIRequestContext }) => {
        await delay(2000)
        const response = await getSummaryPoi(request, loginToken);
        expect.soft(response.ok(), 'Expected response API to be valid').toBeTruthy();
        const responseData = await response.json();
        const summaryPoiExisting = summaryPoi;
        const expectedUnvalidatedPoi = summaryPoiExisting.unvalidated - 1;
        const expectedAssignedPoi = summaryPoiExisting.assigned + 1;

        console.log('Existing unvalidated POI:', summaryPoiExisting.unvalidated);
        console.log('Expected unvalidated POI:', expectedUnvalidatedPoi);
        console.log('Existing assigned POI:', summaryPoiExisting.assigned);
        console.log('Expected assigned POI:', expectedAssignedPoi);

        expect.soft(
            responseData.data.unvalidated.toString(),
            `Expected unvalidated POI count updated, from ${summaryPoiExisting.unvalidated} to ${expectedUnvalidatedPoi}`
        ).toBe(expectedUnvalidatedPoi.toString());

        expect.soft(
            responseData.data.assigned.toString(),
            `Expected assigned POI count to updated, from ${summaryPoiExisting.assigned} to ${expectedAssignedPoi}`
        ).toBe(expectedAssignedPoi.toString());
    });

    test('Validate POI detail has status Proses Survei', async ({ request }) => {
        const responsePoiDetail = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail = await responsePoiDetail.json();

        expect.soft(responseDataPoiDetail.data.idPoi).toBe(poiId);
        expect.soft(responseDataPoiDetail.data.status[0].label).toBe("Proses Survey");

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
                expect.soft(responseDataUploadEvidence.data.mysiisPhotoId).toBeDefined();
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
        console.log(responseDataSubmitSurvey);

        expect.soft(responseSubmitSurvey.ok()).toBeTruthy();
        respondentId = responseDataSubmitSurvey.data.respodentId;
        // saveStorage("respondentId", JSON.stringify(respondentId));
        await delay(1000);
    });

    test('[FIX] Validate POI detail has status Valid Internal', async ({ request }) => {
        await delay(1000);
        const responsePoiDetail = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail = await responsePoiDetail.json();
        expect.soft(responseDataPoiDetail.data.status[0].label).toBe("Proses Approval - POI Hasil Survei");
        expect.soft(responseDataPoiDetail.data.status[1].label).toBe("Valid Internal");
        expect.soft(responseDataPoiDetail.data.idPoi).toBe(poiId);
    });

    test('[FIX] Get Summary POI - After Submit Survey POI', async ({ request }: { request: APIRequestContext }) => {
        await delay(2000)
        const response = await getSummaryPoi(request, loginToken);
        expect.soft(response.ok(), 'Expected response API to be valid').toBeTruthy();
        const responseData = await response.json();
        const summaryPoiExisting = summaryPoi;
        const expectedAssignedPoi = summaryPoiExisting.assigned;
        const expectedapprovalProcessValidInternal = summaryPoiExisting.approvalProcessValidInternal + 1;

        console.log('Existing assigned POI:', summaryPoiExisting.assigned);
        console.log('Expected assigned POI:', expectedAssignedPoi);
        console.log('Existing valid internal POI:', summaryPoiExisting.approvalProcessValidInternal);
        console.log('Expected valid internal POI:', expectedapprovalProcessValidInternal);

        expect.soft(
            responseData.data.assigned.toString(),
            `Expected assigned POI count updated, from ${summaryPoiExisting.assigned} to ${expectedAssignedPoi}`
        ).toBe(expectedAssignedPoi.toString());

        expect.soft(
            responseData.data.approvalProcessValidInternal.toString(),
            `Expected Valid Internal POI count to updated, From ${summaryPoiExisting.approvalProcessValidInternal} to ${expectedapprovalProcessValidInternal}`
        ).toBe(expectedapprovalProcessValidInternal.toString());
    });

    test('Validate POI with Valid Internal status show in MGR Witel', async ({ request }) => {
        const nik = '850162dummy';
        const responseLogin = await login(request, nik);
        const responseData = await responseLogin.json();
        loginTokenMGR = responseData.data.accessToken;

        const payload = {
            page: 1,
            size: 10,
            sortBy: "createdDate",
            sort: "desc"
        };
        const response = await getListSurvey(request, loginTokenMGR, payload);        
        const responseDataListSurvey = await response.json();

        const isIdPoiPresent = responseDataListSurvey.data.some((poi:any) => poi.idPoi === poiId);
        console.log(`make sure ${poiId} is ${isIdPoiPresent}`)
        expect.soft(isIdPoiPresent,`Expect POI id ${poiId} has show in approval survey list`).toBe(true)

    });

    test('Approval Survey by MGR Witel', async ({ request }) => {

        const payload = {
            action: "valid",
            email: email,
            id: respondentId,
            poiId: poiId
        }
        console.log(payload);
        await approveSurveyStep(request, loginTokenMGR, payload);
    });

    test('Get Summary POI - After Approval MGR Witel', async ({ request }: { request: APIRequestContext }) => {
        await delay(2000)
        const response = await getSummaryPoi(request, loginTokenMGR);
        expect.soft(response.ok(), 'Expected response API to be valid').toBeTruthy();
        const responseData = await response.json();
        const summaryPoiExisting = summaryPoi;
        const expectedapprovalProcessValidInternal = summaryPoiExisting.approvalProcessValidInternal;
        const expectedvalid = summaryPoiExisting.valid + 1;

        console.log('Existing Valid POI:', summaryPoiExisting.valid);
        console.log('Expected Valid POI:', expectedvalid);
        console.log('Existing valid internal POI:', summaryPoiExisting.approvalProcessValidInternal);
        console.log('Expected valid internal POI:', expectedapprovalProcessValidInternal);

        expect.soft(
            responseData.data.valid.toString(),
            `Expected Valid POI count updated, from ${summaryPoiExisting.valid} to ${expectedvalid}`
        ).toBe(expectedvalid.toString());

        expect.soft(
            responseData.data.approvalProcessValidInternal.toString(),
            `Expected Valid Internal POI count to updated, from ${summaryPoiExisting.approvalProcessValidInternal} to ${expectedapprovalProcessValidInternal}`
        ).toBe(expectedapprovalProcessValidInternal.toString());
    });
});
