import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../endpoints/auth/postLogin';
import { getListPoi,getListPoiWithSubSector, getListPoiWithOpportunity, getListPoiWithSearch, getListPoiWithUnvalidatedStatus, getListPoiWithValidStatus, getListPoiWithInvalidToken, getListPoiWithoutToken, getListPoiNotValid } from '../../endpoints/poi/getListPoi';
import { getStorage,saveStorage } from '../../../helpers/parsingData';
import { ECOSYSTEM_DATA, expectedColors } from '../../../helpers/constants';

test.describe('Get List POI Endpoint', () => {

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const tokenGenerate = getStorage("generateToken");
        const response = await login(request, tokenGenerate);
        const responseData = await response.json();

        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message,'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        saveStorage("loginToken", responseData.data.accessToken);
    });

    test('Positive Case:[200] Get List POI', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getStorage("loginToken");
        const response = await getListPoi(request, loginToken);
        const responseData = await response.json();
        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message, 'Expected message is "success"').toBe("success");
        expect(responseData.meta.page, 'Expected meta.page is  1').toBe(1);
        expect(responseData.meta.source, 'Expected meta.source is "MyIndibiz Assistant"').toBe("MyIndibiz Assistant");
        expect(responseData.meta.size, 'Expected meta.size is 10').toBe(10);
        expect(responseData.meta.lastUpdate, 'Expected meta.lastUpdate is defined').toBeDefined();

        responseData.data.forEach((poi: { idPoi: any }) => {
            const dataType = 'number';
            expect(typeof poi.idPoi, `Expected poi id is ${dataType}`).toBe(dataType);
        });
    });

    test('Positive Case:[200] Get list POI by search but data is not found', async ({ request }: { request: APIRequestContext }) => {
        const search = 'lalalalala';
        const loginToken = getStorage("loginToken");
        const response = await getListPoiWithSearch(request, loginToken, search);
        const responseData = await response.json();
        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message, 'Expected message is "success"').toBe("success");
        expect(responseData.meta.page, 'Expected meta.page is  1').toBe(0);
        expect(responseData.meta.source, 'Expected meta.source is "MyIndibiz Assistant"').toBe("MyIndibiz Assistant");
        expect(responseData.meta.size, 'Expected meta.size is 10').toBe(0);
        expect(responseData.meta.lastUpdate, 'Expected meta.lastUpdate is defined').toBeDefined();
        expect(responseData.data, 'Expected Data is empty object').toEqual([]);
        expect(responseData.data.length, 'Expected Data dont have data').toBe(0);
    });

    test('Positive Case:[200] Get List POI with Unvalidated Status', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getStorage("loginToken");
        const response = await getListPoiWithUnvalidatedStatus(request, loginToken);
        const responseData = await response.json();
        expect(response.ok()).toBeTruthy();
        expect(responseData.code).toBe(200);
        expect(responseData.message).toBe("success");
        expect(responseData.meta.page).toBe(1);
        expect(responseData.meta.source).toBe("MyIndibiz Assistant");
        expect(responseData.meta.size).toBe(10);
        expect(responseData.meta.lastUpdate).toBeDefined();

        responseData.data.forEach((poi: { idPoi: any }) => {
            const dataType = 'number';
            expect(typeof poi.idPoi,`Expected poi id is ${dataType}`).toBe(dataType);
        });

        responseData.data.forEach((poi: { status: { label: any } }) => {
            const data = 'Data Mentah';
            expect(poi.status[0].label, `Expected status is ${data}`).toBe(data);
        });
    });

    test('Positive Case:[200] Get List POI with Valid Status', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getStorage("loginToken");
        const response = await getListPoiWithValidStatus(request, loginToken);
        const responseData = await response.json();
        expect(response.ok()).toBeTruthy();
        expect(responseData.code).toBe(200);
        expect(responseData.message).toBe("success");
        expect(responseData.meta.page).toBe(1);
        expect(responseData.meta.source).toBe("MyIndibiz Assistant");
        expect(responseData.meta.size).toBe(10);
        expect(responseData.meta.lastUpdate).toBeDefined();

        responseData.data.forEach((poi: { idPoi: any }) => {
            const dataType = 'number';
            expect(typeof poi.idPoi, `Expected poi id is ${dataType}`).toBe(dataType);
        });

        responseData.data.forEach((poi: { status: { label: any } }) => {
            const data = 'Valid';
            expect(poi.status[0].label, `Expected Status is ${data}`).toBe(data);
        });
    });

    const opportunities = ['Enterprise', 'Business Service', 'Government'];
    opportunities.forEach((opportunity: any) => {
        test(`Positive Case:[200] Get List POI with ${opportunity} Opportunity`, async ({ request }: { request: APIRequestContext }) => {
            const loginToken = getStorage("loginToken");
            const response = await getListPoiWithOpportunity(request, loginToken, opportunity);
            const responseData = await response.json();
            expect(response.ok()).toBeTruthy();
            expect(responseData.code).toBe(200);
            expect(responseData.message).toBe("success");
            expect(responseData.meta.page).toBe(1);
            expect(responseData.meta.source).toBe("MyIndibiz Assistant");
            expect(responseData.meta.size).toBe(10);
            expect(responseData.meta.lastUpdate).toBeDefined();

            responseData.data.forEach((poi: { idPoi: any }) => {
                const dataType = 'number';
                expect(typeof poi.idPoi, `Expected poi id is ${dataType}`).toBe(dataType);
            });

            responseData.data.forEach((poi: { segment: { opportunity: any } }) => {
                expect(poi.segment.opportunity,`Expected opportunity is ${opportunity}` ).toBe(opportunity);
            });
        });
    })

    test.skip('Positive Case:[200] Get List POI by sub sector filter', async ({ request }: { request: APIRequestContext }) => {
        const data = "perikanan"
        const loginToken = getStorage("loginToken");
        const response = await getListPoiWithSubSector(request, loginToken, data);
        const responseData = await response.json();
        expect(response.ok()).toBeTruthy();
        expect(responseData.code).toBe(200);
        expect(responseData.message).toBe("success");
        expect(responseData.meta.page).toBe(1);
        expect(responseData.meta.source).toBe("MyIndibiz Assistant");
        expect(responseData.meta.size).toBe(10);
        expect(responseData.meta.lastUpdate).toBeDefined();

        responseData.data.forEach((poi: { segment: { subSector: any } }) => {
            console.log(poi.segment.subSector)
            expect(poi.segment.subSector).toBe(data);
        });

        const ecosystem = ECOSYSTEM_DATA.find((ecosystem: { subSector: string[] }) => ecosystem.subSector.includes(data));
        console.log(ecosystem)
    });

    test.skip('Positive Case:[200] Validation ecosystem and sub sector in POI List is Valid', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getStorage("loginToken");
        const response = await getListPoi(request, loginToken);
        const responseData = await response.json();
        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message, 'Expected message is "success"').toBe("success");
        expect(responseData.meta.page, 'Expected meta.page is  1').toBe(1);
        expect(responseData.meta.source, 'Expected meta.source is "MyIndibiz Assistant"').toBe("MyIndibiz Assistant");
        expect(responseData.meta.size, 'Expected meta.size is 10').toBe(10);
        expect(responseData.meta.lastUpdate, 'Expected meta.lastUpdate is defined').toBeDefined();

        responseData.data.forEach((item:any, index:any) => {
            const expectedEcosystem = ECOSYSTEM_DATA[index].ecosystem;
            const expectedSubSector = ECOSYSTEM_DATA[index].subSector; 
            const actualEcosystem = item.ecosystem;
            const actualSubSector = item.subSector;
            const idPoi = item.idPoi;
    
            try{
                expect(actualEcosystem,`${idPoi} Expected Ecosystem: ${expectedEcosystem}, Actual Ecosystem: ${actualEcosystem}`).toBe(expectedEcosystem)
                expect(actualSubSector,`${idPoi} Expected Sub Sector: ${expectedSubSector},  Actual Sub Sector: ${actualSubSector}`).toBe(expectedSubSector)
            } catch (error) {
                throw new Error(`${idPoi} Expected Ecosystem: ${expectedEcosystem}, Actual Ecosystem: ${actualEcosystem} \n
                    ${idPoi} Expected Sub Sector: ${expectedSubSector},  Actual Sub Sector: ${actualSubSector}`)
            }
        })

    });

    test('Positive Case:[200] Validation color and status in POI List is Valid', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getStorage("loginToken");
        const response = await getListPoi(request, loginToken);
        const responseData = await response.json();
    
        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message, 'Expected message is "success"').toBe("success");
        expect(responseData.meta.page, 'Expected meta.page is  1').toBe(1);
        expect(responseData.meta.source, 'Expected meta.source is "MyIndibiz Assistant"').toBe("MyIndibiz Assistant");
        expect(responseData.meta.size, 'Expected meta.size is 10').toBe(10);
        expect(responseData.meta.lastUpdate, 'Expected meta.lastUpdate is defined').toBeDefined();
    
        responseData.data.forEach((item: any, index: number) => {
            const statusArray = item.status;
    
            if (statusArray && statusArray.length > 0) {
                statusArray.forEach((status: { label: string; color: string }, statusIndex: number) => {
                    const label = status.label;
                    const color = status.color;
    
                    expect(color,`${item.idPoi} ${statusIndex} Expected color is ${color}, Actual color is ${expectedColors[label]} ` ).toBe(expectedColors[label]);
                });
            } else {
                const statusType = index === 0 ? 'Status POI' : 'Source POI';
                throw new Error(`${statusType} is missing for item at index ${index}`);
            }
        });
    });

    test('Negative Case:[400] Get List POI with request not valid', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getStorage("loginToken");
        const response = await getListPoiNotValid(request, loginToken);
        const responseData = await response.json();
        const metaMessage = "Payload request List POI invalid! Kesalahan validasi terdeteksi:\nJumlah kesalahan: 1\n1. [root]: must NOT have additional properties"
        const subMessage = "Silakan coba lagi"
        expect(responseData.code, 'Expected response code is 400').toBe(400);
        expect(responseData.message, 'Expected message is "Bad Request!"').toBe("Bad Request!");
        expect(responseData.meta.message, `Expected meta.message is "${metaMessage}"`).toBe(metaMessage);
        expect(responseData.meta.subMessage, `Expected meta.submessage is "${subMessage}"`).toBe(subMessage);
    });

    test('Negative Case: [401] Get List POI with Invalid Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getListPoiWithInvalidToken(request);
        const responseData = await response.json();

        expect(response.status(), 'Expected status code is 401').toBe(401);
        expect(responseData.message, 'Expected message is "access token expired or in invalid format"').toBe("access token expired or in invalid format");
    });

    test('Negative Case: [401] Get List POI Without Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getListPoiWithoutToken(request);
        const responseData = await response.json();

        expect(response.status(), 'Expected status code is 401').toBe(401);
        expect(responseData.message, 'Expected message is "required authorization headers"').toBe("required authorization headers");
    });
});
