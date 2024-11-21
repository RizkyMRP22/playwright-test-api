import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getListPoi } from '../../../endpoints/poi/getListPoi';
import { postAssignPoiHOTD } from '../../../endpoints/poi/postAssignPoi';
import { getPoiDetail } from '../../../endpoints/poi/getPoiDetail';
import { postSubmitSurveyPoi } from '../../../endpoints/poi/postSubmitSurvey';
import { postUploadEvidence } from '../../../endpoints/poi/postUploadEvidence';
import { getStorage, saveStorage } from '../../../../../helpers/parsingData';
import { approveSurveyStep } from '../../../scenarios/approval/postApprovalSurvey.ts';
import { getSummaryPoi } from '../../../endpoints/poi/getSummaryPoi';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test.describe.serial('[E2E] Profiling POI By HOTD', () => {
    let loginToken: string;
    let poiId: string;
    let email: string;
    let respondentId: string;
    let summaryPoi: any;

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const response = await login(request);
        const responseData = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(responseData.code).toBe(200);
        expect(responseData.message).toBe("Your Request Has Been Processed");

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
    });

    test('Get List POI with Data Mentah', async ({ request }: { request: APIRequestContext }) => {
        const params = {
            page: 1,
            size: 10,
            sort: "desc"
        };
    
        const response = await getListPoi(request, loginToken, params);
        const responseData = await response.json();    
        expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
        if (responseData.data.length > 1) {
        // Select a random POI index
        const randomIndex = Math.floor(Math.random() * responseData.data.length);
        const selectedPoi = responseData.data[randomIndex];
            poiId = responseData.data[0].idPoi;
            console.log(`Randomly selected POI ID: ${selectedPoi.idPoi} random index ${randomIndex}`);
        } else {
            console.warn('Expected more than 1 record but got:', responseData.data.length);
        }
    });``
      
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
    
    // Validate assignment response
    expect(responseDataAssign.message, 'Expected Message POI berhasil diassign').toBe('POI berhasil diassign');
    });

    test('Get Summary POI - After Assignment POI', async ({ request }: { request: APIRequestContext }) => {
        const response = await getSummaryPoi(request, loginToken);
        expect.soft(response.ok(), 'Expected response API to be valid').toBeTruthy();
        const responseData = await response.json();
        const summaryPoiExisting = summaryPoi;
        const expectedUnvalidatedPoi = summaryPoiExisting.unvalidated - 1;
        const expectedAssignedPoi = summaryPoiExisting.assigned + 1;
    
        // Debug logs
        console.log('Existing unvalidated POI:', summaryPoiExisting.unvalidated);
        console.log('Expected unvalidated POI:', expectedUnvalidatedPoi);
        console.log('Existing assigned POI:', summaryPoiExisting.assigned);
        console.log('Expected assigned POI:', expectedAssignedPoi);
    
        // Assertions for unvalidated POI
        expect.soft(
            responseData.data.unvalidated.toString(),
            `Expected unvalidated POI count updated, from ${summaryPoiExisting.unvalidated} to ${expectedUnvalidatedPoi}`
        ).toBe(expectedUnvalidatedPoi.toString());
    
        // Assertions for assigned POI
        expect.soft(
            responseData.data.assigned.toString(),
            'Expected assigned POI count to updated'
        ).toBe(expectedAssignedPoi.toString());
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
        console.log(responseDataSubmitSurvey);

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
        console.log(responseDataPoiDetail);

        expect(responseDataPoiDetail.data.status[0].label).toBe("Proses Approval - POI Hasil Survei");
        expect(responseDataPoiDetail.data.status[1].label).toBe("Valid Internal");
        expect(responseDataPoiDetail.data.idPoi).toBe(poiId);
        expect(responseDataPoiDetail.data.respondentId).toBe(Number(respondentId));
    });

    test('Get Summary POI - After Submit Survey POI', async ({ request }: { request: APIRequestContext }) => {
        const response = await getSummaryPoi(request, loginToken);
        expect.soft(response.ok(), 'Expected response API to be valid').toBeTruthy();
        const responseData = await response.json();
        const summaryPoiExisting = summaryPoi;
        const expectedAssignedPoi = summaryPoiExisting.assigned - 1;
        const expectedapprovalProcessValidInternal = summaryPoiExisting.approvalProcessValidInternal + 1;
    
        // Debug logs
        console.log('Existing assigned POI:', summaryPoiExisting.assigned);
        console.log('Expected assigned POI:', expectedAssignedPoi);
        console.log('Existing valid internal POI:', summaryPoiExisting.approvalProcessValidInternal);
        console.log('Expected valid internal POI:', expectedapprovalProcessValidInternal);
    
        // Assertions for assigned POI
        expect.soft(
            responseData.data.assigned.toString(),
            `Expected assigned POI count updated, from ${summaryPoiExisting.assigned} to ${expectedAssignedPoi}`
        ).toBe(expectedAssignedPoi.toString());
    
        // Assertions for valid internal POI
        expect.soft(
            responseData.data.approvalProcessValidInternal.toString(),
            'Expected assigned POI count to updated'
        ).toBe(expectedapprovalProcessValidInternal.toString());
    });

    test('Approval Survey by MGR Witel', async ({ request }) => {
        const nik = '850162dummy';
        const response = await login(request, nik);
        const responseData = await response.json();
        loginToken = responseData.data.accessToken;

        const payload = {
            action: "valid",
            email: email,
            id: respondentId,
            poiId: poiId
        }
        console.log(payload);
        await approveSurveyStep(request, loginToken, payload);
    });

    test('Get Summary POI - After Approval MGR Witel', async ({ request }: { request: APIRequestContext }) => {
        const response = await getSummaryPoi(request, loginToken);
        expect.soft(response.ok(), 'Expected response API to be valid').toBeTruthy();
        const responseData = await response.json();
        const summaryPoiExisting = summaryPoi;
        const expectedapprovalProcessValidInternal = summaryPoiExisting.approvalProcessValidInternal - 1;
        const expectedvalid= summaryPoiExisting.valid + 1;

    
        // Debug logs
        console.log('Existing assigned POI:', summaryPoiExisting.valid);
        console.log('Expected assigned POI:', expectedvalid);
        console.log('Existing valid internal POI:', summaryPoiExisting.approvalProcessValidInternal);
        console.log('Expected valid internal POI:', expectedapprovalProcessValidInternal);
    
        // Assertions for valid POI
        expect.soft(
            responseData.data.assigned.toString(),
            `Expected assigned POI count updated, from ${summaryPoiExisting.valid} to ${expectedvalid}`
        ).toBe(expectedvalid.toString());
    
        // Assertions for valid internal POI
        expect.soft(
            responseData.data.approvalProcessValidInternal.toString(),
            'Expected assigned POI count to updated'
        ).toBe(expectedapprovalProcessValidInternal.toString());
    });
});
