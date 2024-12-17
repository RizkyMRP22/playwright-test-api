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
import { getStorage } from '../../../../helpers/parsingData';

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
    let suggestEcosystem: string;
    let selectedEcosystem: string;

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        await test.step('Log in to get access token', async () => {
            const response = await LoginCases.validLogin(request);
            loginToken = response.data.accessToken;
        });
    });

    test('Add New POI - Ecosystem based on suggest', async ({ request }) => {
        await test.step('Verify user can get summary POI', async () => {
            const response = await SummaryPoiCases.getSummaryPOI(request, loginToken);
            summaryPoiExisting = response.data;
        });

        await test.step('Choose Opportunity Business', async () => {
            await OpportunityListCases.getOpportunityList(request, loginToken);
        });

        await test.step('Choose Sector Business', async () => {
            await SectorListCases.getSectorList(request, loginToken, opportunityId);
        });

        await test.step('Choose Sub Sector Business', async () => {
            await SubSectorCases.getSubSector(request, loginToken, sectorId);
        });

        await test.step('Choose Ecosystem Business', async () => {
            selectedEcosystem = await EcosystemListCases.getEcosystemList(request, loginToken);
            console.log(`Selected ecosystem ${selectedEcosystem} and suggest Ecosystem ${suggestEcosystem}`);
        });

        await test.step('Upload Image', async () => {
            const filename = 'background_diponogoro.jpeg';
            const response = await UploadImagesCases.postUploadImages(request, loginToken, filename);
            imageUrl = response.data.url;
        });

        await test.step('Create Add New POI from MyTens', async () => {
            const getData = getStorage('business')
            const { sectorId, subSectorId, opportunityId, suggestEcosystem, selectedEcosystem, sectorName, subSectorName, opportunityName } = getData;

            const requests = {
                photo: imageUrl,
                ecosystem: suggestEcosystem ?? selectedEcosystem,
                sectorId: sectorId,
                subSectorId: subSectorId,
                opportunityId: opportunityId,
                sectorName: sectorName,
                subSectorName:subSectorName,
                opportunityName: opportunityName
            }

            const response = await AddNewPOICases.postAddNewPoi(request, loginToken, requests);
            poiId = response.data.idPoi;
            payloads = requests;
        });

        await test.step('Validate POI detail has status Proses Survei', async () => {
            const status = {
                label0: 'Proses Survey',
                label1: 'Assigned',
            };
            await DetailPoiCases.getPoiDetail(request, loginToken, poiId, status);
        });

        await test.step('Validate assignment POI detail has status Proses Survei', async () => {
            const status = 'Proses Survey';
            const getData = await getStorage('payload-addNewPoi');
            const dataRequest = {
                ...getData,
                payloads,
            };
            await AssignmentPoiDetailCases.getAssignmentPoiDetail(request, loginToken, poiId, status, dataRequest);
        });

        await test.step('Get Summary POI - After Add New POI', async () => {
            await delay(2000);

            const response = await SummaryPoiCases.getSummaryPOI(request, loginToken);
            const expectedTotalPoi = summaryPoiExisting.totalPoi + 1;
            const expectedAssignedPoi = summaryPoiExisting.assigned + 1;

            BaseTestCase.assertCompare(
                [
                    {
                        message: `Expected Total POI count update, from ${summaryPoiExisting.totalPoi} to ${expectedTotalPoi}`,
                        actual: response.data.totalPoi,
                        expected: expectedTotalPoi,
                        useSoft: true,
                    },
                    {
                        message: `Expected assigned POI count update, from ${summaryPoiExisting.assigned} to ${expectedAssignedPoi}`,
                        actual: response.data.assigned,
                        expected: expectedAssignedPoi,
                        useSoft: true,
                    },
                ],
                response.data,
            );
        });
    });

    test('Add New POI - Change Ecosystem', async ({ request }) => {
        await test.step('Verify user can get summary POI', async () => {
            const response = await SummaryPoiCases.getSummaryPOI(request, loginToken);
            summaryPoiExisting = response.data;
            console.info(summaryPoiExisting);
        });

        await test.step('Choose Opportunity Business', async () => {
            await OpportunityListCases.getOpportunityList(request, loginToken);
        });

        await test.step('Choose Sector Business', async () => {
            await SectorListCases.getSectorList(request, loginToken, opportunityId);
        });

        await test.step('Choose Sub Sector Business', async () => {
            await SubSectorCases.getSubSector(request, loginToken, sectorId);
        });

        await test.step('Choose Ecosystem Business', async () => {
            selectedEcosystem = await EcosystemListCases.getEcosystemList(request, loginToken);
            console.log(`Selected ecosystem ${selectedEcosystem} and suggest Ecosystem ${suggestEcosystem}`);
        });

        await test.step('Upload Image', async () => {
            const filename = 'background_diponogoro.jpeg';
            const response = await UploadImagesCases.postUploadImages(request, loginToken, filename);
            imageUrl = response.data.url;
        });

        await test.step('Create Add New POI from MyTens', async () => {
            const getData = getStorage('business')
            const { sectorId, subSectorId, opportunityId, suggestEcosystem, selectedEcosystem, sectorName, subSectorName, opportunityName } = getData;
    
            const requests = {
                photo: imageUrl,
                ecosystem: selectedEcosystem,
                sectorId: sectorId,
                subSectorId: subSectorId,
                opportunityId: opportunityId,
                sectorName: sectorName,
                subSectorName:subSectorName,
                opportunityName: opportunityName
            }
            
            const response = await AddNewPOICases.postAddNewPoi(request, loginToken, requests);
            poiId = response.data.idPoi;
            payloads = requests;
        });

        await test.step('Validate POI detail has status Proses Survei', async () => {
            const status = {
                label0: 'Proses Survey',
                label1: 'Assigned',
            };
            await DetailPoiCases.getPoiDetail(request, loginToken, poiId, status);
        });

        await test.step('Validate assignment POI detail has status Proses Survei', async () => {
            const status = 'Proses Survey';
            const getData = await getStorage('payload-addNewPoi');
            const dataRequest = {
                ...getData,
                payloads,
            };
            await AssignmentPoiDetailCases.getAssignmentPoiDetail(request, loginToken, poiId, status, dataRequest);
        });

        await test.step('Get Summary POI - After Add New POI', async () => {
            await delay(2000);

            const response = await SummaryPoiCases.getSummaryPOI(request, loginToken);
            const expectedTotalPoi = summaryPoiExisting.totalPoi + 1;
            const expectedAssignedPoi = summaryPoiExisting.assigned + 1;

            BaseTestCase.assertCompare(
                [
                    {
                        message: `Expected Total POI count update, from ${summaryPoiExisting.totalPoi} to ${expectedTotalPoi}`,
                        actual: response.data.totalPoi,
                        expected: expectedTotalPoi,
                        useSoft: true,
                    },
                    {
                        message: `Expected assigned POI count update, from ${summaryPoiExisting.assigned} to ${expectedAssignedPoi}`,
                        actual: response.data.assigned,
                        expected: expectedAssignedPoi,
                        useSoft: true,
                    },
                ],
                response.data,
            );
        });
    });

});