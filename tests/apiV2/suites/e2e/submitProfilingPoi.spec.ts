import { test } from '@playwright/test';
import LoginCases from '../../scenarios/auth/login.cases';
import SummaryPoiCases from '../../scenarios/poi/summaryPoi.cases';
import listPoiCases from '../../scenarios/poi/listPoi.cases';
import CreateAssignmentPoi from '../../scenarios/poi/createAssignmentPoi.cases';
import DetailPoiCases from '../../scenarios/poi/detailPoi.cases';
import BaseTestCase from '../../../../helpers/baseTestCase';
import UploadImagesCases from '../../scenarios/poi/uploadImages.cases';
import SubmitSurveyPoiCases from '../../scenarios/poi/submitSurveyPoi.cases';
import ApprovalSurveyPoiCases from '../../scenarios/poi/approvalSurvey.cases';
import AssignmentPoiDetailCases from '../../scenarios/poi/assignmentPoiDetail.cases';
import AssignmentPoiList from '../../scenarios/poi/assignmentList.cases';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


interface SummaryPoi {
    totalPoi: number;
    unvalidated: number;
    assigned: number;
    approvalProcessValidInternal: number;
    valid: number;
}

let loginToken: string;
let email: string;
let poiId: string;
let summaryPoiExisting: SummaryPoi;

test.describe.serial('[E2E] Submit Profiling POI by HOTD', () => {

    test('HOTD can create profiling POI', async ({ request }) => { 
        await test.step('User HOTD is Login', async () => {
            const response = await LoginCases.validLogin(request);
            loginToken = response.data.accessToken
            email = response.data.email;
        });

        await test.step('Get POI Summary', async () => {
            const response = await SummaryPoiCases.getSummaryPOI(request, loginToken);
            summaryPoiExisting = response.data;
            console.info(summaryPoiExisting);
        });

        await test.step('Get POI list with Data Mentah Status', async () => {
            const params = {
                page: 1,
                size: 10,
                sort: "desc",
                status: "dataMentah"
            }
            const response = await listPoiCases.getListPoi(request, loginToken, params);
            poiId = response
        });

        await test.step('Post Assignment POI', async () => {
            const payload = {
                poiId,
                emailUserAgent: email,
                assignTo: "HOTD",
                assignmentType: "validasi"
            };
            await CreateAssignmentPoi.postAssignmentPoi(request, loginToken, payload);
            await delay(1000);
        });

        await test.step('Get POI Summary - After Assignment POI', async () => {
            const response = await SummaryPoiCases.getSummaryPOI(request, loginToken);
            const expectedUnvalidatedPoi = summaryPoiExisting.unvalidated - 1;
            const expectedAssignedPoi = summaryPoiExisting.assigned + 1;

            BaseTestCase.assertCompare([
                {
                    message: `Expected Unvalidated POI count update, from ${summaryPoiExisting.unvalidated} to ${expectedUnvalidatedPoi}`,
                    actual: response.data.unvalidated,
                    expected: expectedUnvalidatedPoi,
                    useSoft: true
                },
                {
                    message: `Expected Assigned POI count to updated, from ${summaryPoiExisting.assigned} to ${expectedAssignedPoi}`,
                    actual: response.data.assigned,
                    expected: expectedAssignedPoi,
                    useSoft: true
                }
            ], response.data);  
        });

        await test.step('Get POI detail with status Proses Survey', async () => {
            const status = {
                label0:'Proses Survey',
                label1: 'Assigned'
            }
            await DetailPoiCases.getPoiDetail(request, loginToken, poiId, status);
        });

        await test.step('Get POI in list Assignment', async () => {
            await AssignmentPoiList.getAssignmentPoiList(request, loginToken, poiId);
        });

        await test.step('Get assignment POI detail with status Proses Survey', async () => {
            const status = 'Proses Survey';
            await AssignmentPoiDetailCases.getAssignmentPoiDetail(request, loginToken, poiId,status);
        });

        await test.step('Upload Evidence Survey', async () => {
            await UploadImagesCases.postUploadEvidence(request, loginToken, poiId);
            await delay(1000);
        }); 

        await test.step('Upload Evidence Activity', async () => {
            await UploadImagesCases.postEvidence(request, loginToken, poiId);
            await delay(1000);
        }); 

        await test.step('Submit Survey POI', async () => {
            await SubmitSurveyPoiCases.submitSurveyPoi(request, loginToken);
        });

        await test.step('Get POI detail with status Valid Internal', async () => {
            const status = {
                label0:'Proses Approval - POI Hasil Survei',
                label1: 'Valid Internal'
            }
            await DetailPoiCases.getPoiDetail(request, loginToken, poiId, status);
        });

        await test.step('Get assignment POI detail with status Proses Approval', async () => {
            const status = 'Proses Approval';
            await AssignmentPoiDetailCases.getAssignmentPoiDetail(request, loginToken, poiId,status);
        });

        await test.step('Get POI Summary - After Submit Survey POI', async () => {
            const response = await SummaryPoiCases.getSummaryPOI(request, loginToken);
            const expectedAssignedPoi = summaryPoiExisting.assigned;
            const expectedApprovalProcessValidInternal = summaryPoiExisting.approvalProcessValidInternal + 1;

            BaseTestCase.assertCompare([
                {
                    message: `Expected Valid Internal POI count update, from ${summaryPoiExisting.approvalProcessValidInternal} to ${expectedApprovalProcessValidInternal}`,
                    actual: response.data.approvalProcessValidInternal,
                    expected: expectedApprovalProcessValidInternal,
                    useSoft: true
                },
                {
                    message: `Expected Assigned POI count to updated, from ${summaryPoiExisting.assigned + 1} to ${expectedAssignedPoi}`,
                    actual: response.data.assigned,
                    expected: expectedAssignedPoi,
                    useSoft: true
                }
            ], response.data);  
        });

    });

    test('MGR Witel can Approve profiling POI from HOTD', async ({ request }) => {
        let loginTokenMGR: string;

        await test.step('MGR Witel is Login', async () => {
            const payload = {
                username: process.env.NIK_MGR_WITEL
            }
            const response = await LoginCases.validLogin(request, payload);
            loginTokenMGR = response.data.accessToken
        });

        await test.step('MGR Witel can approve survey POI', async () => {
            const payload = {
                poiId,
                email,
                action:'valid'

            }
            await ApprovalSurveyPoiCases.postApprovalSurvey(request,loginTokenMGR, payload);
        });
    });

    test('HOTD will get POI whose status is already valid', async ({ request }) => {
        await test.step('Get POI detail with status Proses Survey', async () => {
            const status = {
                label0:'Valid',
            }
            await DetailPoiCases.getPoiDetail(request, loginToken, poiId, status);
        });

        await test.step('Get assignment POI detail with status Valid', async () => {
            const status = 'Valid';
            await AssignmentPoiDetailCases.getAssignmentPoiDetail(request, loginToken, poiId,status);
        });

        await test.step('Get POI Summary - After Validated Survey POI', async () => {
            const response = await SummaryPoiCases.getSummaryPOI(request, loginToken);
            const expectedApprovalProcessValidInternal = summaryPoiExisting.approvalProcessValidInternal;
            const expectedValid = summaryPoiExisting.valid + 1;

            BaseTestCase.assertCompare([
                {
                    message: `Expected Valid Internal POI count update, from ${summaryPoiExisting.approvalProcessValidInternal+1} to ${expectedApprovalProcessValidInternal}`,
                    actual: response.data.approvalProcessValidInternal,
                    expected: expectedApprovalProcessValidInternal,
                    useSoft: true
                },
                {
                    message: `Expected Valid POI count to updated, from ${summaryPoiExisting.valid} to ${expectedValid}`,
                    actual: response.data.valid,
                    expected: expectedValid,
                    useSoft: true
                }
            ], response.data);  
        });
    });
});