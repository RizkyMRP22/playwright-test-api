import { test, APIRequestContext } from '@playwright/test';
import LoginCases from '../../scenarios/auth/login.cases';
import DetailPoiCases from '../../scenarios/poi/detailPoi.cases';
import AssignmentPoiDetailCases from '../../scenarios/poi/assignmentPoiDetail.cases';
import AssignmentPoiList from '../../scenarios/poi/assignmentList.cases';
import SummaryPoiCases from '../../scenarios/poi/summaryPoi.cases';
import listPoiCases from '../../scenarios/poi/listPoi.cases';
import CreateAssignmentPoi from '../../scenarios/poi/createAssignmentPoi.cases';
import UploadImagesCases from '../../scenarios/poi/uploadImages.cases';
import SubmitSurveyPoiCases from '../../scenarios/poi/submitSurveyPoi.cases';
import { saveStorage, getStorage } from '../../../../helpers/parsingData';
import ListSurveyPoiCases from '../../scenarios/poi/listSurveyPoi.cases';


let loginToken:string;
let email:string;
let poiId:string;

test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
    const response = await LoginCases.validLogin(request);
    loginToken = response.data.accessToken
    email = response.data.email;
});

test.describe('API GET Summary POI', () => {

    test('[200] Verify user can get summary POI', async ({ request }) => {
        await SummaryPoiCases.getSummaryPOI(request, loginToken);
    });

    test('[401] Verify user cant get summary poi with invalid token', async ({ request }) => {
        await SummaryPoiCases.getSummaryPOIWithInvalidToken(request);
    });
});

test.describe('API GET List POI', () => {
    test('[200] Verify user can get POI list', async ({ request }) => {
        const params = {
            page: 1,
            size: 10,
            sort: "desc",
            status: "dataMentah"
        }
       const response = await listPoiCases.getListPoi(request, loginToken, params);
       console.log(response);
       poiId = response
       saveStorage('poiId', poiId);
    });
});

test.describe('API GET Detail POI', () => {

    const poiId = '63347479';
    test('[200] Verify user can get POI detail', async ({ request }) => {
        const status = {
            label0:'Proses Survey',
            label1: 'Assigned'
        }
        await DetailPoiCases.getPoiDetail(request, loginToken, poiId, status);
    });

    test('[401] Verify user cant get POI detail with invalid token', async ({ request }) => {
        await DetailPoiCases.getPoiDetailWithInvalidToken(request, poiId);
    });
});

test.describe('API GET List Assignment POI', () => {

    test('[200] Verify user can get Assignment POI detail', async ({ request }) => {
        const params = {
            status : 'valid'
        }
        await AssignmentPoiList.getAssignmentPoiList(request, loginToken, params);
    });

});

test.describe('API GET Detail Assignment POI', () => {

    const poiId = '63347479';
    test('[200] Verify user can get Assignment POI detail', async ({ request }) => {
        await AssignmentPoiDetailCases.getAssignmentPoiDetail(request, loginToken, poiId);
    });

    test('[401] Verify user cant get Assignment POI detail with invalid token', async ({ request }) => {
        await AssignmentPoiDetailCases.getAssignmentPoiDetailWithInvalidToken(request, poiId);
    });
});

test.describe('API POST Assignment POI', () => {
    test('[200] Verify user can post assignment POI', async ({ request }) => {
        poiId = getStorage('poiId');
        const payload = {
            poiId,
            emailUserAgent: email,
            assignTo: "HOTD",
            assignmentType: "validasi"
        };
        await CreateAssignmentPoi.postAssignmentPoi(request, loginToken, payload);
    });
});

test.describe('API POST Upload Image', () => {
    test('[200] Verify user can Upload Image', async ({ request }) => {
        await UploadImagesCases.postUploadImages(request, loginToken);
    });
});

test.describe('API POST Upload Evidence Survey', () => {
    test('[200] Verify user can Upload Evidence Survey', async ({ request }) => {
        const poiId = getStorage('poiId');
        await UploadImagesCases.postUploadEvidence(request, loginToken, poiId);
    });
});

test.describe('API POST Submit Survey POI', () => {
    test.fail('[200] Verify user can Submit Survey POI', async ({ request }) => {
        await SubmitSurveyPoiCases.submitSurveyPoi(request, loginToken);
    });
});

test.describe('API GET List Survey POI', () => {
    test('[200] Verify user can get list Survey POI', async ({ request }) => {
        const params = {
            page:1,
            size:10
        }
        const response = await ListSurveyPoiCases.getListSurveyPoi(request, loginToken, params, 35568323);
        console.log(response);
    });
});

test.describe('API POST Upload Images', () => {
    test('[200] Verify User can upload image for activity evidence', async ({ request }) => { 
        const poiId = '10224686';
        const response = await UploadImagesCases.postEvidence(request, loginToken, poiId)
        console.log('response: ', response);
    })
});
