import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getListPoi, getListPoiWithInvalidToken, getListPoiWithoutToken, getListPoiNotValid } from '../../../endpoints/poi/getListPoi';
import { getStorage, saveStorage } from '../../../../../helpers/parsingData';
import { ECOSYSTEM_DATA, expectedColors, expectedStatus, expectedOpportunities } from '../../../../../helpers/constants';
import { getPoiList } from '../../../scenarios/poi/getListPoi';


test.describe('API GET List POI', () => {

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const response = await login(request);
        const responseData = await response.json();

        expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code is 200').toBe(200);
        expect.soft(responseData.message, 'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        saveStorage("loginToken", responseData.data.accessToken);
    });

    test('Positive Case:[200] Get List POI all data with Pagination, Size, and Sort', async ({ request }: { request: APIRequestContext }) => {
        const params = {
            page: 1,
            size: 10,
            sort: "desc"
        }
        const loginToken = getStorage("loginToken");
        const response = await getListPoi(request, loginToken, params);
        const responseData = await response.json();
        expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code is 200').toBe(200);
        expect.soft(responseData.message, 'Expected message is "success"').toBe("success");
        expect.soft(responseData.meta.page, 'Expected meta.page is  1').toBe(1);
        expect.soft(responseData.meta.source, 'Expected meta.source is "MyIndibiz Assistant"').toBe("MyIndibiz Assistant");
        expect.soft(responseData.meta.size, 'Expected meta.size is 10').toBe(10);
        expect.soft(responseData.meta.lastUpdate, 'Expected meta.lastUpdate is defined').toBeDefined();

        responseData.data.forEach((poi: { idPoi: any }) => {
            const dataType = 'number';
            expect.soft(typeof poi.idPoi, `Expected poi id is ${dataType}`).toBe(dataType);
            saveStorage("poiId", poi.idPoi);
        });
    });

    test('Positive Case:[200] Get list POI by search but data is not found', async ({ request }: { request: APIRequestContext }) => {
        const params = {
            page: 1,
            size: 10,
            sort: "desc",
            search: 'lalalalala'
        }

        const loginToken = getStorage("loginToken");
        const response = await getListPoi(request, loginToken, params);
        const responseData = await response.json();
        expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code is 200').toBe(200);
        expect.soft(responseData.message, 'Expected message is "success"').toBe("success");
        expect.soft(responseData.meta.page, 'Expected meta.page is  1').toBe(1);
        expect.soft(responseData.meta.source, 'Expected meta.source is "MyIndibiz Assistant"').toBe("MyIndibiz Assistant");
        expect.soft(responseData.meta.size, 'Expected meta.size is 10').toBe(10);
        expect.soft(responseData.meta.lastUpdate, 'Expected meta.lastUpdate is defined').toBeDefined();
        expect.soft(responseData.data, 'Expected Data is empty object').toEqual([]);
        expect.soft(responseData.data.length, 'Expected Data dont have data').toBe(0);
    });

    expectedStatus.forEach((status: any) => {
        test(`Positive Case:[200] Get List POI with ${status.value} Status`, async ({ request }: { request: APIRequestContext }) => {
            const params = {
                page: 1,
                size: 10,
                sort: "desc",
                status: status.key
            }
            const loginToken = getStorage("loginToken");
            const response = await getListPoi(request, loginToken, params);
            const responseData = await response.json();
            expect.soft(response.ok()).toBeTruthy();
            expect.soft(responseData.code).toBe(200);
            expect.soft(responseData.message).toBe("success");
            expect.soft(responseData.meta.source).toBe("MyIndibiz Assistant");
            expect.soft(responseData.meta.lastUpdate).toBeDefined();

            responseData.data.forEach((poi: { idPoi: any }) => {
                const dataType = 'number';
                expect.soft(typeof poi.idPoi, `Expected poi id is ${dataType}`).toBe(dataType);
            });

            responseData.data.forEach((poi: { status: { label: any } }) => {
                expect.soft(poi.status[0].label, `Expected status is ${status.value}`).toBe(status.value);
            });
        });
    })

    test('Positive Case:[200] Get List POI with Multiple Status', async ({ request }: { request: APIRequestContext }) => {
        const params = {
            page: 1,
            size: 10,
            sort: "desc",
            status: 'dataMentah, prosesSurvei'
        }
        const loginToken = getStorage("loginToken");
        const response = await getListPoi(request, loginToken, params);
        const responseData = await response.json();
        expect.soft(response.ok()).toBeTruthy();
        expect.soft(responseData.code).toBe(200);
        expect.soft(responseData.message).toBe("success");
        // if (responseData.data.length >= 1) {
        //     expect.soft(responseData.meta.page).toBe(1);
        // } else {
        //     expect.soft(responseData.meta.page).toBe(0);

        // }
        expect.soft(responseData.meta.source).toBe("MyIndibiz Assistant");
        // if (responseData.data.length >= 1) {
        //     expect.soft(responseData.meta.size).toBe(10);
        // } else {
        //     expect.soft(responseData.meta.page).toBe(0);

        // }
        expect.soft(responseData.meta.lastUpdate).toBeDefined();

        responseData.data.forEach((poi: { idPoi: any }) => {
            const dataType = 'number';
            expect.soft(typeof poi.idPoi, `Expected poi id is ${dataType}`).toBe(dataType);
        });

        const validStatuses = ['Data Mentah', 'Proses Survey'];
        responseData.data.forEach((poi: { status: { label: string }[] }) => {
            if (poi.status.length > 0) {
                expect.soft(validStatuses, `Expected List Poi to contain status ${validStatuses}`).toContain(poi.status[0].label);
            } else {
                throw new Error("Status array is empty, expected at least one status.");
            }
        });
    });

    expectedOpportunities.forEach((opportunity: any) => {
        test(`Positive Case:[200] Get List POI with ${opportunity.name} Opportunity`, async ({ request }: { request: APIRequestContext }) => {
            const params = {
                page: 1,
                size: 10,
                sort: "desc",
                opportunity: opportunity.name
            }

            const loginToken = getStorage("loginToken");
            const response = await getListPoi(request, loginToken, params);
            const responseData = await response.json();
            expect.soft(response.ok()).toBeTruthy();
            expect.soft(responseData.code).toBe(200);
            expect.soft(responseData.message).toBe("success");
            expect.soft(responseData.meta.page).toBe(1);
            expect.soft(responseData.meta.source).toBe("MyIndibiz Assistant");
            expect.soft(responseData.meta.size).toBe(10);
            expect.soft(responseData.meta.lastUpdate).toBeDefined();

            responseData.data.forEach((poi: { idPoi: any }) => {
                const dataType = 'number';
                expect.soft(typeof poi.idPoi, `Expected poi id is ${dataType}`).toBe(dataType);
            });

            responseData.data.forEach((poi: { segment: { opportunity: any } }) => {
                expect.soft(poi.segment.opportunity, `Expected opportunity is ${opportunity.name}`).toBe(opportunity.name);
            });
        });
    })

    test('Positive Case:[200] Get List POI by sub sector filter', async ({ request }: { request: APIRequestContext }) => {
        const params = {
            page: 1,
            size: 10,
            sort: "desc",
            subSector: 'perikanan'
        }
        const loginToken = getStorage("loginToken");
        const response = await getListPoi(request, loginToken, params);
        const responseData = await response.json();
        expect.soft(response.ok()).toBeTruthy();
        expect.soft(responseData.code).toBe(200);
        expect.soft(responseData.message).toBe("success");
        expect.soft(responseData.meta.page).toBe(1);
        expect.soft(responseData.meta.source).toBe("MyIndibiz Assistant");
        expect.soft(responseData.meta.size).toBe(10);
        expect.soft(responseData.meta.lastUpdate).toBeDefined();

        responseData.data.forEach((poi: { segment: { subSector: any } }) => {
            console.log(poi.segment.subSector)
            expect.soft(poi.segment.subSector).toBe(params.subSector);
        });

        const subSector = params.subSector;
        const ecosystem = ECOSYSTEM_DATA.find((ecosystem: { subSector: string[] }) => ecosystem.subSector.includes(subSector));
        console.log(ecosystem)
    });

    test('Positive Case:[200] Validation ecosystem and sub sector in POI List is Valid', async ({ request }: { request: APIRequestContext }) => {
        const params = {
            page: 1,
            size: 10,
            sort: "desc"
        }
        const loginToken = getStorage("loginToken");
        const response = await getListPoi(request, loginToken, params);
        const responseData = await response.json();
        expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code is 200').toBe(200);
        expect.soft(responseData.message, 'Expected message is "success"').toBe("success");
        expect.soft(responseData.meta.page, 'Expected meta.page is  1').toBe(1);
        expect.soft(responseData.meta.source, 'Expected meta.source is "MyIndibiz Assistant"').toBe("MyIndibiz Assistant");
        expect.soft(responseData.meta.size, 'Expected meta.size is 10').toBe(10);
        expect.soft(responseData.meta.lastUpdate, 'Expected meta.lastUpdate is defined').toBeDefined();

        responseData.data.forEach((item: any, index: any) => {
            const expectedEcosystem = ECOSYSTEM_DATA[index].ecosystem;
            const expectedSubSector = ECOSYSTEM_DATA[index].subSector;
            const actualEcosystem = item.ecosystem;
            const actualSubSector = item.subSector;
            const idPoi = item.idPoi;

            try {
                expect.soft(actualEcosystem, `${idPoi} Expected Ecosystem: ${expectedEcosystem}, Actual Ecosystem: ${actualEcosystem}`).toBe(expectedEcosystem)
                expect.soft(actualSubSector, `${idPoi} Expected Sub Sector: ${expectedSubSector},  Actual Sub Sector: ${actualSubSector}`).toBe(expectedSubSector)
            } catch (error) {
                throw new Error(`${idPoi} Expected Ecosystem: ${expectedEcosystem}, Actual Ecosystem: ${actualEcosystem} \n
                    ${idPoi} Expected Sub Sector: ${expectedSubSector},  Actual Sub Sector: ${actualSubSector}`)
            }
        })

    });

    test('Positive Case:[200] Validation color and status in POI List is Valid', async ({ request }: { request: APIRequestContext }) => {
        const params = {
            page: 1,
            size: 10,
            sort: "desc"
        }
        const loginToken = getStorage("loginToken");
        const response = await getListPoi(request, loginToken, params);
        const responseData = await response.json();

        expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code is 200').toBe(200);
        expect.soft(responseData.message, 'Expected message is "success"').toBe("success");
        expect.soft(responseData.meta.page, 'Expected meta.page is  1').toBe(1);
        expect.soft(responseData.meta.source, 'Expected meta.source is "MyIndibiz Assistant"').toBe("MyIndibiz Assistant");
        expect.soft(responseData.meta.size, 'Expected meta.size is 10').toBe(10);
        expect.soft(responseData.meta.lastUpdate, 'Expected meta.lastUpdate is defined').toBeDefined();

        responseData.data.forEach((item: any, index: number) => {
            const statusArray = item.status;

            if (statusArray && statusArray.length > 0) {
                statusArray.forEach((status: { label: string; color: string }, statusIndex: number) => {
                    const label = status.label;
                    const color = status.color;

                    expect.soft(color, `${item.idPoi} ${statusIndex} Expected color is ${color}, Actual color is ${expectedColors[label]} `).toBe(expectedColors[label]);
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
        expect.soft(responseData.code, 'Expected response code is 400').toBe(400);
        expect.soft(responseData.message, 'Expected message is "Bad Request!"').toBe("Bad Request!");
        expect.soft(responseData.meta.message, `Expected meta.message is "${metaMessage}"`).toBe(metaMessage);
        expect.soft(responseData.meta.subMessage, `Expected meta.submessage is "${subMessage}"`).toBe(subMessage);
    });

    test('Negative Case: [401] Get List POI with Invalid Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getListPoiWithInvalidToken(request);
        const responseData = await response.json();

        expect.soft(response.status(), 'Expected status code is 401').toBe(401);
        expect.soft(responseData.message, 'Expected message is "access token expired or in invalid format"').toBe("access token expired or in invalid format");
    });

    test('Negative Case: [401] Get List POI Without Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getListPoiWithoutToken(request);
        const responseData = await response.json();

        expect.soft(response.status(), 'Expected status code is 401').toBe(401);
        expect.soft(responseData.message, 'Expected message is "required authorization headers"').toBe("required authorization headers");
    });
});
