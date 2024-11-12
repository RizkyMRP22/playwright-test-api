import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getSector, getSectorInvalidToken, getSectorWithoutToken } from '../../../endpoints/poi/getSector';
import { getStorage, saveStorage } from '../../../../helpers/parsingData';
import { expectedOpportunities } from '../../../../helpers/constants';


test.describe('API GET List Sector', () => {

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const response = await login(request);
        const responseData = await response.json();

        expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code is 200').toBe(200);
        expect.soft(responseData.message, 'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        saveStorage("loginToken", responseData.data.accessToken);
    });

    expectedOpportunities.forEach((opportunity) => {
        test(`Positive Case:[200] Get List Sector ${opportunity.name}`, async ({ request }: { request: APIRequestContext }) => {
            const loginToken = getStorage("loginToken");
            const response = await getSector(request, loginToken, opportunity.id);
            const responseData = await response.json();

            console.log("opportunity.id: ", opportunity.id)
            console.log("opportunity.name: ", opportunity.name)
            console.log("opportunity.sector: ", opportunity.sector)


            expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
            expect.soft(responseData.code, 'Expected response code is 200').toBe(200);
            expect.soft(responseData.message, 'Expected message is "Success"').toBe("Success");
            expect.soft(responseData.data, 'Expected data sector to match expected sector list').toStrictEqual(opportunity.sector);

            responseData.data.forEach((sector: { opportunityId: number }) => {
                expect.soft(sector.opportunityId, `Expected sector.opportunityId to match ${opportunity.id} for ${opportunity.name}`).toBe(opportunity.id);
            });

        })
    });

    test(`Positive Case:[404] Get List Sector with Invalid opportunity`, async ({ request }: { request: APIRequestContext }) => {
        const opportunityId = 5
        const loginToken = getStorage("loginToken");
        const response = await getSector(request, loginToken, opportunityId);
        const responseData = await response.json();

        expect.soft(responseData.code, 'Expected response code is 404').toBe(404);
        expect.soft(responseData.message, 'Expected message is "Opportunity Tidak Ditemukan"').toBe("Opportunity Tidak Ditemukan");
    });

    test('Negative Case: [401] Get List Sector POI with Invalid Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getSectorInvalidToken(request);
        const responseData = await response.json();

        expect.soft(responseData.code, 'Expected response code is 401').toBe(401);
        expect.soft(responseData.message, 'Expected message is "access token expired or in invalid format"').toBe("access token expired or in invalid format");

    });

    test('Negative Case: [401] Get List Sector POI Without Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getSectorWithoutToken(request);
        const responseData = await response.json();

        expect.soft(responseData.code, 'Expected response code is 401').toBe(401);
        expect.soft(responseData.message, 'Expected message is "required authorization headers"').toBe("required authorization headers");

    });
    
});
