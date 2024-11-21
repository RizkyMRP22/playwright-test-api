import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getListPoi } from '../../../endpoints/poi/getListPoi';
import { postAssignPoiHOTD } from '../../../endpoints/poi/postAssignPoi';
import { getPoiDetail } from '../../../endpoints/poi/getPoiDetail';
import { postCancelAssignPoi }  from '../../../endpoints/poi/postCancelAssignPoi';
import { getStorage, saveStorage , delay, searchById} from '../../../../../helpers/parsingData';
import { getSummaryPoi } from '../../../endpoints/poi/getSummaryPoi';
import { getListAssignment } from '../../../endpoints/poi/getListAssignmentPoi';

test.describe.serial('[E2E] Cancel Assign POI by HOTD', () => {

    let loginToken: string;
    let poiId: string;
    let nik: string;
    let summaryPoi: any;

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const response = await login(request);
        const responseData = await response.json();

        expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code is 200').toBe(200);
        expect.soft(responseData.message,'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        loginToken = responseData.data.accessToken;
        nik = responseData.data.nik;
        saveStorage("loginToken", loginToken);
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

        console.log("Data Summary Before assignment")
        console.log("Data Mentah: ", summaryPoi.unvalidated)
        console.log("Data Proses Survey: ", summaryPoi.assigned)
    });


    test('Get List POI with Data Mentah', async ({ request }) => {
        const params = {
            size: 1,
            page: 10,
            sort: 'desc',
            status: 'dataMentah'
        };
        const responseList = await getListPoi(request, loginToken, params);
        const responseDataList = await responseList.json();

        expect.soft(responseDataList.message, `Expected success message when retrieving POI`).toBe("success");

        responseDataList.data.forEach(poi => {
            const expectedStatus = 'Data Mentah';
            expect.soft(poi.status[0].label, `Expected POI ${poi.idPoi} status to be ${expectedStatus}`).toBe(expectedStatus);
        });

        poiId = responseDataList.data[0].idPoi;
        saveStorage("poiDetail", JSON.stringify(responseDataList.data[0]));
    });

    test('Assignment POI', async ({ request }: { request: APIRequestContext }) => {
        const payload = {
            poiId: poiId,
            emailUserAgent: nik,
            assignTo: "HOTD",
            assignmentType: "validasi"
        };

        const responseAssign = await postAssignPoiHOTD(request, loginToken, payload);
        const responseDataAssign = await responseAssign.json();
        expect.soft(responseDataAssign.message, `Expected message is "POI ${poiId} berhasil diassign"`).toBe("POI berhasil diassign");
        await delay(3000)
    });

    test('Get List Assignment to Me POI in Mobile ', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getStorage("loginToken");
        const response = await getListAssignment(request, loginToken);
        const responseData = await response.json();
        expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();

        //   // Search by ID
        const searchId = poiId; // Example ID to search
        const foundItem = searchById(responseData.data, searchId);

        // Validate the search result
        expect.soft(foundItem, `Expected to find an item with ID ${searchId}`).not.toBeNull();
    });

    test('Validate POI detail has status Proses Survei', async ({ request }: { request: APIRequestContext }) => {
        const responsePoiDetail = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail = await responsePoiDetail.json();
        console.log('responseDataPoiDetail', JSON.stringify(responseDataPoiDetail,null,2));
        expect.soft(responseDataPoiDetail.data.idPoi, `Expected POI ID "${poiId}" Match with request`).toBe(poiId);
        expect.soft(responseDataPoiDetail.data.status[0].label, `Expected Status POI "${poiId}" is "Proses Survey"`).toBe("Proses Survey");
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

        console.log("Data Summary After assignment")
        console.log("Data Mentah: ", summaryPoi.unvalidated)
        console.log("Data Proses Survey: ", summaryPoi.assigned)
    
        // Assertions for unvalidated POI
        expect.soft(
            responseData.data.unvalidated.toString(),
            `Expected unvalidated POI count updated, from ${summaryPoiExisting.unvalidated} to ${expectedUnvalidatedPoi}`
        ).toBe(expectedUnvalidatedPoi.toString());
    
        // Assertions for assigned POI
        expect.soft(
            responseData.data.assigned.toString(),
            `Expected assigned POI count to updated, from ${summaryPoiExisting.assigned} to ${expectedAssignedPoi}`
        ).toBe(expectedAssignedPoi.toString());
    });

    test('Cancel Assignment POI', async ({ request }: { request: APIRequestContext }) => {
        const responseCancel = await postCancelAssignPoi(request, loginToken, poiId);
        const responseDataCancel = await responseCancel.json();
        expect.soft(responseDataCancel.message, `Expected message is "POI berhasil di cancel"`).toBe("POI berhasil di cancel");
        await delay(3000)
    });

    test('Validate POI detail has status Data Mentah', async ({ request }: { request: APIRequestContext }) => {
        const responsePoiDetail2 = await getPoiDetail(request, loginToken, poiId);
        const responseDataPoiDetail2 = await responsePoiDetail2.json();
        expect.soft(responseDataPoiDetail2.data.idPoi, `Expected POI ID "${poiId}" Match with request`).toBe(poiId);
        expect.soft(responseDataPoiDetail2.data.status[0].label, `Expected Status POI "${poiId}" is "Data Mentah"`).toBe("Data Mentah");
    });

    test('Get Summary POI - After Cancel POI', async ({ request }: { request: APIRequestContext }) => {
        const response = await getSummaryPoi(request, loginToken);
        expect.soft(response.ok(), 'Expected response API to be valid').toBeTruthy();
        const responseData = await response.json();
        const summaryPoiExisting = summaryPoi;
        const expectedUnvalidatedPoi = summaryPoiExisting.unvalidated + 1;
        const expectedAssignedPoi = summaryPoiExisting.assigned - 1;
    
        // Debug logs
        console.log('Existing unvalidated POI:', summaryPoiExisting.unvalidated);
        console.log('Expected unvalidated POI:', expectedUnvalidatedPoi);
        console.log('Existing assigned POI:', summaryPoiExisting.assigned);
        console.log('Expected assigned POI:', expectedAssignedPoi);

        console.log("Data Summary After cancel assignment")
        console.log("Data Mentah: ", summaryPoi.unvalidated)
        console.log("Data Proses Survey: ", summaryPoi.assigned)
    
        // Assertions for unvalidated POI
        expect.soft(
            responseData.data.unvalidated.toString(),
            `Expected unvalidated POI count updated, from ${summaryPoiExisting.unvalidated} to ${expectedUnvalidatedPoi}`
        ).toBe(expectedUnvalidatedPoi.toString());
    
        // Assertions for assigned POI
        expect.soft(
            responseData.data.assigned.toString(),
            `Expected assigned POI count to updated, from ${summaryPoiExisting.assigned} to ${expectedAssignedPoi}`
        ).toBe(expectedAssignedPoi.toString());
    });

});
