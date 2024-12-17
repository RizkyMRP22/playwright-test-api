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
import Constants from '../../../../helpers/constants';

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
let initialSummary: SummaryPoi;
let summaryAfterAssign: SummaryPoi;
let summaryAfterSurvey: SummaryPoi;

test.describe.serial('[E2E] Submit Profiling POI by HOTD', () => {

    test('HOTD can create profiling POI', async ({ request }) => { 
        await test.step('User HOTD is Login', async () => {
            const response = await LoginCases.validLogin(request);
            loginToken = response.data.accessToken
            email = response.data.email;
        });

        await test.step('Get POI Summary', async () => {
            const response = await SummaryPoiCases.getSummaryPOI(request, loginToken);
            initialSummary = response.data;
            console.info("initialSummary: ",initialSummary);
        });

        await test.step('Get POI list with Data Mentah Status', async () => {
            const params = {
                page: 1,
                size: 10,
                sort: "desc",
                status: Constants.POI_STATUS.DATA_MENTAH.FILTER
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
            summaryAfterAssign = response.data;
            console.log("summaryAfterAssign: ",summaryAfterAssign)
            const expectedUnvalidatedPoi = initialSummary.unvalidated - 1;
            const expectedAssignedPoi = initialSummary.assigned + 1;
            console.info("expectedUnvalidatedPoi: ",expectedUnvalidatedPoi);
            console.info("expectedAssignedPoi: ",expectedAssignedPoi);


            BaseTestCase.assertCompare([
                {
                    message: `Expected Unvalidated POI count update, from ${initialSummary.unvalidated} to ${expectedUnvalidatedPoi}`,
                    actual: response.data.unvalidated,
                    expected: expectedUnvalidatedPoi,
                    useSoft: true
                },
                {
                    message: `Expected Assigned POI count to updated, from ${initialSummary.assigned} to ${expectedAssignedPoi}`,
                    actual: response.data.assigned,
                    expected: expectedAssignedPoi,
                    useSoft: true
                }
            ], response.data);  
        });

        await test.step('Get POI detail with status Proses Survey', async () => {
            const status = {
                label0:Constants.POI_STATUS.PROSES_SURVEY.LABEL,
                label1: Constants.POI_STATUS.PROSES_SURVEY.CHILD.LABEL
            }
            await DetailPoiCases.getPoiDetail(request, loginToken, poiId, status);
        });

        await test.step('Get POI in list Assignment', async () => {
            await AssignmentPoiList.getAssignmentPoiList(request, loginToken, poiId);
        });

        await test.step('Get assignment POI detail with status Proses Survey', async () => {
            const status = Constants.POI_STATUS.PROSES_SURVEY.LABEL;
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
                label0:Constants.POI_STATUS.PROSES_APPROVAL.LABEL,
                label1: Constants.POI_STATUS.PROSES_APPROVAL.CHILD.LABEL
            }
            await DetailPoiCases.getPoiDetail(request, loginToken, poiId, status);
        });

        await test.step('Get assignment POI detail with status Proses Approval', async () => {
            const status = 'Proses Approval';
            await AssignmentPoiDetailCases.getAssignmentPoiDetail(request, loginToken, poiId,status);
        });

        await test.step('Get POI Summary - After Submit Survey POI', async () => {
            const response = await SummaryPoiCases.getSummaryPOI(request, loginToken);
            summaryAfterSurvey = response.data;
            const expectedAssignedPoi = summaryAfterAssign.assigned-1;
            const expectedApprovalProcessValidInternal = summaryAfterAssign.approvalProcessValidInternal + 1;

            BaseTestCase.assertCompare([
                {
                    message: `Expected Valid Internal POI count update, from ${summaryAfterAssign.approvalProcessValidInternal} to ${expectedApprovalProcessValidInternal}`,
                    actual: response.data.approvalProcessValidInternal,
                    expected: expectedApprovalProcessValidInternal,
                    useSoft: true
                },
                {
                    message: `Expected Assigned POI count to updated, from ${summaryAfterAssign.assigned + 1} to ${expectedAssignedPoi}`,
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
                action: Constants.POI_STATUS.VALID.FILTER

            }
            await ApprovalSurveyPoiCases.postApprovalSurvey(request,loginTokenMGR, payload);
        });
    });

    test('HOTD will get POI whose status is already valid', async ({ request }) => {
        await test.step('Get POI detail with status Proses Survey', async () => {
            const status = {
                label0:Constants.POI_STATUS.VALID.LABEL,
            }
            await DetailPoiCases.getPoiDetail(request, loginToken, poiId, status);
        });

        await test.step('Get assignment POI detail with status Valid', async () => {
            const status = Constants.POI_STATUS.VALID.LABEL;
            await AssignmentPoiDetailCases.getAssignmentPoiDetail(request, loginToken, poiId,status);
        });

        await test.step('Get POI Summary - After Validated Survey POI', async () => {
            const response = await SummaryPoiCases.getSummaryPOI(request, loginToken);
            const summaryAfterApprove = response.data;
            const expectedApprovalProcessValidInternal = summaryAfterSurvey.approvalProcessValidInternal-1;
            const expectedValid = summaryAfterSurvey.valid + 1;

            BaseTestCase.assertCompare([
                {
                    message: `Expected Valid Internal POI count update, from ${summaryAfterSurvey.approvalProcessValidInternal} to ${expectedApprovalProcessValidInternal}`,
                    actual: response.data.approvalProcessValidInternal,
                    expected: expectedApprovalProcessValidInternal,
                    useSoft: true
                },
                {
                    message: `Expected Valid POI count to updated, from ${summaryAfterSurvey.valid} to ${expectedValid}`,
                    actual: response.data.valid,
                    expected: expectedValid,
                    useSoft: true
                }
            ], response.data);  
        });
    });
});