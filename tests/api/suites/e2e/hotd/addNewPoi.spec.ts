import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { postAddNewPOI } from '../../../scenarios/poi/postAddNewPoi'
import { payloadAddNewPOI } from '../../../../../helpers/mock'
import { getPoiDetail } from '../../../endpoints/poi/getPoiDetail';
import { postUploadImages } from '../../../scenarios/poi/postUploadImages'
import { getSummaryPoi } from '../../../endpoints/poi/getSummaryPoi';
import { getAssignmentPoiDetail } from '../../../scenarios/poi/getAssignmentPoiDetail'


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

test.describe.serial('[E2E] Create Add New POI by HOTD', () => {

    let loginToken:string;
    let email: string;
    let nik: string;
    let poiId: string;
    let imageUrl: string;
    interface SummaryPoi {
        totalPoi: number;
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
        nik = responseData.data.nik;
        email=responseData.data.email
    });

    test('Get Summary POI', async ({ request }: { request: APIRequestContext }) => {
        const response = await getSummaryPoi(request, loginToken);
        expect.soft(response.ok(), 'Expected response API to be valid').toBeTruthy();
        const responseData = await response.json();
        summaryPoi = responseData.data;
        console.info(summaryPoi)
    });


    test('Upload Image', async ({ request }: { request: APIRequestContext }) => {
        const response = await postUploadImages(request, loginToken);
        const responseData = await response.json();
        imageUrl = responseData.data.url
        console.log(imageUrl)
    });

    test('Create Add New POI from MyTens', async ({ request }: { request: APIRequestContext }) => {
        const payload = {
            photo: imageUrl,
            ...payloadAddNewPOI()
        }
        const response = await postAddNewPOI(request, loginToken,payload);
        poiId = response.data.idPoi
        console.log(response)
    });

    test('Validate POI detail has status Proses Survei', async ({ request }) => {
        const responsePoiDetail = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail = await responsePoiDetail.json();
        console.log(JSON.stringify(responseDataPoiDetail,null,2))
        expect.soft(responseDataPoiDetail.data.idPoi,`Expected ID POI ${poiId} Match`).toBe(Number(poiId));
        expect.soft(responseDataPoiDetail.data.assignBy, `Expected assignBy is match with user created`).toBe("920194dummy");
        expect.soft(responseDataPoiDetail.data.status[0].label, `Expected status is Proses Survey`).toBe("Proses Survey");
        expect.soft(responseDataPoiDetail.data.status[2].label, `Expected label chip source is MyTens`).toBe("MyTEnS");

        expect.soft(responseDataPoiDetail.data.information.address, `Expected address match with request`).toBe(payloadAddNewPOI().address);
        expect.soft(responseDataPoiDetail.data.information.long, `Expected Longitude match with request`).toBe(payloadAddNewPOI().longitude.toString());
        expect.soft(responseDataPoiDetail.data.information.lat,  `Expected Latitude match with request`).toBe(payloadAddNewPOI().latitude.toString());

        expect.soft(responseDataPoiDetail.data.information.source, `Expected information source is MyTens`).toBe("MyTEnS");
    });

    test('Validate assignment POI detail has status Proses Survei', async ({ request }) => {
        const responseDataPoiDetail = await getAssignmentPoiDetail(request, loginToken, poiId);
        console.log(JSON.stringify(responseDataPoiDetail,null,2))
        expect.soft(responseDataPoiDetail.data.poi.poiId,`Expected ID POI ${poiId} Match`).toBe(Number(poiId));
        expect.soft(responseDataPoiDetail.data.poi.source, `Expected POI source is MyTEnS`).toBe("MyTEnS")
        expect.soft(responseDataPoiDetail.data.poi.poiName, `Expected POI Name match with request`).toBe(payloadAddNewPOI().name)
        expect.soft(responseDataPoiDetail.data.poi.address, `Expected address match with request`).toBe(payloadAddNewPOI().address);
        expect.soft(responseDataPoiDetail.data.poi.longitude, `Expected Longitude match with request`).toBe(payloadAddNewPOI().longitude);
        expect.soft(responseDataPoiDetail.data.poi.latitude,  `Expected Latitude match with request`).toBe(payloadAddNewPOI().latitude);
        expect.soft(responseDataPoiDetail.data.label.poiStatus.label, `Expected status is Proses Survey`).toBe("Proses Survey")
    });

    test('Get Summary POI - After Add New POI', async ({ request }: { request: APIRequestContext }) => {
        await delay(2000)
        const response = await getSummaryPoi(request, loginToken);
        expect.soft(response.ok(), 'Expected response API to be valid').toBeTruthy();
        const responseData = await response.json();
        const summaryPoiExisting = summaryPoi;
        const expectedTotalPoi = summaryPoiExisting.totalPoi + 1;
        const expectedAssignedPoi = summaryPoiExisting.assigned + 1;

        console.log(responseData.data)

        expect.soft(
            responseData.data.totalPoi.toString(),
            `Expected unvalidated POI count updated, from ${summaryPoiExisting.totalPoi} to ${expectedTotalPoi}`
        ).toBe(expectedTotalPoi.toString());

        expect.soft(
            responseData.data.assigned.toString(),
            `Expected assigned POI count to updated, from ${summaryPoiExisting.assigned} to ${expectedAssignedPoi}`
        ).toBe(expectedAssignedPoi.toString());
    });

});