import { test, expect, APIRequestContext } from '@playwright/test';
import LoginCasess from '../../scenarios/auth/login.cases';
import DetailPoiCases from '../../scenarios/poi/detailPoi.cases';
import AssignmentPoiDetailCases from '../../scenarios/poi/assignmentPoiDetail.cases';
import SummaryPoiCases from '../../scenarios/poi/summaryPoi.cases';

let loginToken:string;

test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
    const response = await LoginCasess.validLogin(request);
    loginToken = response.data.accessToken
});

test.describe('API GET Summary POI', () => {

    test('Verify user can get summary POI', async ({ request }) => {
        await SummaryPoiCases.getSummaryPOI(request, loginToken);
    });

    test('Verify user cant get summary poi with invalid token', async ({ request }) => {
        await SummaryPoiCases.getSummaryPOIWithInvalidToken(request);
    });
});

test.describe('API GET Detail POI POI', () => {

    const poiId = '63347479';
    test('Verify user can get POI detail', async ({ request }) => {
        await DetailPoiCases.getPoiDetail(request, loginToken, poiId);
    });

    test('Verify user cant get POI detail with invalid token', async ({ request }) => {
        await DetailPoiCases.getPoiDetailWithInvalidToken(request, poiId);
    });
});

test.describe('API GET Detail Assignment POI POI', () => {

    const poiId = '63347479';
    test('Verify user can get Assignment POI detail', async ({ request }) => {
        await AssignmentPoiDetailCases.getAssignmentPoiDetail(request, loginToken, poiId);
    });

    test('Verify user cant get Assignment POI detail with invalid token', async ({ request }) => {
        await AssignmentPoiDetailCases.getAssignmentPoiDetailWithInvalidToken(request, poiId);
    });
});
