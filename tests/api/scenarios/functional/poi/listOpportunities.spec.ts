import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getOpportunity, getOpportunityInvalidToken, getOpportunityWithoutToken } from '../../../endpoints/poi/getOpportunity';
import { getStorage, saveStorage } from '../../../../../helpers/parsingData';
import { expectedOpportunities } from '../../../../../helpers/constants';


test.describe('API GET List Opportunities', () => {
    
    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const response = await login(request);
        const responseData = await response.json();

        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message,'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        saveStorage("loginToken", responseData.data.accessToken);
    });

    test('Positive Case:[200] Get List Opportunities POI', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getStorage("loginToken");
        const response = await getOpportunity(request, loginToken);
        const responseData = await response.json();
    
        expect(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect(responseData.code, 'Expected response code is 200').toBe(200);
        expect(responseData.message,'Expected message is "Success"').toBe("Success");

        const simplifiedExpectedData = expectedOpportunities.map((opportunity: { id: number, name: string }) => ({
            id: opportunity.id,
            name: opportunity.name
        }));

        expect(responseData.data, 'Expected data opportunity is valid').toStrictEqual(simplifiedExpectedData)
    });

    test('Negative Case: [401] Get List Opportunities POI with Invalid Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getOpportunityInvalidToken(request);
        const responseData = await response.json();

        expect(responseData.code, 'Expected response code is 401').toBe(401);
        expect(responseData.message, 'Expected message is "access token expired or in invalid format"').toBe("access token expired or in invalid format");

    });

    test('Negative Case: [401] Get List Opportunities  POI Without Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getOpportunityWithoutToken(request);
        const responseData = await response.json();

        expect(responseData.code, 'Expected response code is 401').toBe(401);
        expect(responseData.message, 'Expected message is "required authorization headers"').toBe("required authorization headers");

    });
});
