import { test, expect, APIRequestContext } from '@playwright/test';
import LoginCases from '../../scenarios/auth/login.cases';
import SummaryPoiCases from '../../scenarios/poi/summaryPoi.cases';
import UploadImagesCases from '../../scenarios/poi/uploadImages.cases';
import AddNewPOICases from '../../scenarios/poi/addNewPoi.cases';
import PayloadRequest from '../../../../helpers/generatePayload';
import DetailPoiCases from '../../scenarios/poi/detailPoi.cases';
import AssignmentPoiDetailCases from '../../scenarios/poi/assignmentPoiDetail.cases';
import CustomAssertion from '../../../../helpers/customAssertion';
import BaseTestCase from '../../../../helpers/baseTestCase';


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface SummaryPoi {
    totalPoi: number;
    unvalidated: number;
    assigned: number;
    approvalProcessValidInternal: number;
    valid: number;
}

test.describe.serial('[E2E] Create Add New POI by HOTD', () => {

    let loginToken: string;
    let email: string;
    let nik: string;
    let poiId: string;
    let imageUrl: string;
    let summaryPoiExisting: SummaryPoi;
    let payloads: any

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const response = await LoginCases.validLogin(request);
        loginToken = response.data.accessToken
        email = response.data.email;
        nik = response.data.nik;
    });

    test('Verify user can get summary POI', async ({ request }) => {
        const response = await SummaryPoiCases.getSummaryPOI(request, loginToken);
        summaryPoiExisting = response.data;
        console.info(summaryPoiExisting)
    });

    test('Upload Image', async ({ request }) => {
        const filename = 'background_diponogoro.jpeg';
        const response = await UploadImagesCases.postUploadImages(request, loginToken, filename);
        imageUrl = response.data.url
    });

    test('Create Add New POI from MyTens', async ({ request }: { request: APIRequestContext }) => {
        const payload = {
            photo: imageUrl,
            ...PayloadRequest.addNewPoi()
        }

        const response = await AddNewPOICases.postAddNewPoi(request, loginToken, payload);
        poiId = response.data.idPoi
        payloads = payload
    });

    test('Validate POI detail has status Proses Survei', async ({ request }) => {
        await DetailPoiCases.getPoiDetail(request, loginToken, poiId, payloads);
    });

    test('Validate assignment POI detail has status Proses Survei', async ({ request }) => {
        await AssignmentPoiDetailCases.getAssignmentPoiDetail(request, loginToken, poiId, payloads);
    });

    test('Get Summary POI - After Add New POI', async ({ request }: { request: APIRequestContext }) => {
        await delay(2000)

        const response = await SummaryPoiCases.getSummaryPOI(request, loginToken)
        const expectedTotalPoi = summaryPoiExisting.totalPoi + 1;
        const expectedAssignedPoi = summaryPoiExisting.assigned + 1;
        
        BaseTestCase.assertCompare([
            {
                message: `Expected Total POI count update, from ${summaryPoiExisting.totalPoi} to ${expectedTotalPoi}`,
                actual: response.data.totalPoi,
                expected: expectedTotalPoi,
                useSoft: true
            },
            {
                message: `Expected assigned POI count to updated, from ${summaryPoiExisting.assigned} to ${expectedAssignedPoi}`,
                actual: response.data.assigned,
                expected: expectedAssignedPoi,
                useSoft: true
            }
        ], response.data);
    });

});