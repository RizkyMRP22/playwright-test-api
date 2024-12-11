import { test, APIRequestContext } from '@playwright/test';
import LoginCases from '../../scenarios/auth/login.cases';
import SummaryPoiCases from '../../scenarios/poi/summaryPoi.cases';
import UploadImagesCases from '../../scenarios/poi/uploadImages.cases';
import AddNewPOICases from '../../scenarios/poi/addNewPoi.cases';
import PayloadRequest from '../../../../helpers/generatePayload';
import DetailPoiCases from '../../scenarios/poi/detailPoi.cases';
import AssignmentPoiDetailCases from '../../scenarios/poi/assignmentPoiDetail.cases';
import BaseTestCase from '../../../../helpers/baseTestCase';
import OpportunityListCases from '../../scenarios/poi/opportunityList.cases';
import SectorListCases from '../../scenarios/poi/sectorList.Cases';
import SubSectorCases from '../../scenarios/poi/subSector.cases';
import EcosystemListCases from '../../scenarios/poi/ecosystemList.cases';

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
    let poiId: string;
    let imageUrl: string;
    let summaryPoiExisting: SummaryPoi;
    let payloads: any;
    let opportunityId: number;
    let sectorId: number;
    let subSectorId: number;
    let suggestEcosystem:string;
    let selectedEcosystem:string;

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const response = await LoginCases.validLogin(request);
        loginToken = response.data.accessToken
    });

    test('Verify user can get summary POI', async ({ request }) => {
        const response = await SummaryPoiCases.getSummaryPOI(request, loginToken);
        summaryPoiExisting = response.data;
        console.info(summaryPoiExisting)
    });

    test('Choose Opportunity Business', async ({ request }) => {
        await OpportunityListCases.getOpportunityList(request, loginToken);
     });
     test('Choose Sector Business', async ({ request }) => {
       await SectorListCases.getSectorList(request, loginToken, opportunityId);
    });
    test('Choose Sub Sector Business', async ({ request }) => {
       await SubSectorCases.getSubSector(request, loginToken, sectorId);
    });
    test('Choose Ecosystem Business', async ({ request }) => {
        selectedEcosystem  = await EcosystemListCases.getEcosystemList(request, loginToken);
        console.log(`Selected ecosystem ${selectedEcosystem} and suggest Ecosystem ${suggestEcosystem}`)
    });

    test('Upload Image', async ({ request }) => {
        const filename = 'background_diponogoro.jpeg';
        const response = await UploadImagesCases.postUploadImages(request, loginToken, filename);
        imageUrl = response.data.url
    });

    test('Create Add New POI from MyTens', async ({ request }: { request: APIRequestContext }) => {
        const payload = {
            photo: imageUrl,
        }
        const response = await AddNewPOICases.postAddNewPoi(request, loginToken, payload);
        console.log("Response: ",response)
        poiId = response.data.idPoi
        payloads = payload
    });

    test('Validate POI detail has status Proses Survei', async ({ request }) => {
        const status = {
            label0:'Proses Survey',
            label1: 'Assigned'
        }

        await DetailPoiCases.getPoiDetail(request, loginToken, poiId, status);
    });

    test('Validate assignment POI detail has status Proses Survei', async ({ request }) => {
        const status = 'Proses Survey';
        await AssignmentPoiDetailCases.getAssignmentPoiDetail(request, loginToken, poiId,status, payloads);
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