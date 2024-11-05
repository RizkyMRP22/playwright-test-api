import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../endpoints/auth/login';
import { getListPoi,getListPoiWithOpportunity, getListPoiWithSearch,getListPoiWithUnvalidatedStatus, getListPoiWithValidStatus ,getListPoiWithInvalidToken, getListPoiWithoutToken } from '../../endpoints/poi/getListPoi';
import { getTokenGenerate, getLoginToken, setLoginToken } from '../../../helpers/authTokens';

test.describe('Get List POI Endpoint', () => {
    
    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const tokenGenerate = getTokenGenerate();
        const response = await login(request, tokenGenerate);
        const responseData = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(responseData.code).toBe(200);
        expect(responseData.message).toBe("Your Request Has Been Processed");

        setLoginToken(responseData.data.accessToken);
    });

    test('Positive Case:[200] Get List POI', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getLoginToken();
        const response = await getListPoi(request, loginToken);
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
            expect(typeof poi.idPoi).toBe(dataType) ;
        });
    });

    test('Positive Case:[200] Get list POI by search but data is not found', async ({ request }: { request: APIRequestContext }) => {
        const search = 'lalalalala';
        const loginToken = getLoginToken();
        const response = await getListPoiWithSearch(request, loginToken, search);
        const responseData = await response.json();
        expect(response.ok()).toBeTruthy();
        expect(responseData.code).toBe(200);  
        expect(responseData.message).toBe("success");
        expect(responseData.meta.page).toBe(0);
        expect(responseData.meta.source).toBe("MyIndibiz Assistant");
        expect(responseData.meta.size).toBe(0);
        expect(responseData.meta.lastUpdate).toBeDefined();
        expect(responseData.data).toEqual([]);
        expect(responseData.data.length).toBe(0);
    });

    test('Positive Case:[200] Get List POI with Unvalidated Status', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getLoginToken();
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
            expect(typeof poi.idPoi).toBe(dataType) ;
        });

        responseData.data.forEach((poi: { status: {label:any} }) => {
            const data = 'Data Mentah';
            expect(poi.status[0].label).toBe(data) ;
        });
    });

    test('Positive Case:[200] Get List POI with Valid Status', async ({ request }: { request: APIRequestContext }) => {
        const loginToken = getLoginToken();
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
            expect(typeof poi.idPoi).toBe(dataType) ;
        });

        responseData.data.forEach((poi: { status: {label:any} }) => {
            const data = 'Valid';
            expect(poi.status[0].label).toBe(data) ;
        });
    });

    test('Positive Case:[200] Get List POI with Enterprise Opportunity', async ({ request }: { request: APIRequestContext }) => {
        const opportunity = 'Enterprise';
        const loginToken = getLoginToken();
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
            expect(typeof poi.idPoi).toBe(dataType) ;
        });

        responseData.data.forEach((poi: { segment: {opportunity:any} }) => {
            const data = 'Valid';
            expect(poi.segment.opportunity).toBe(opportunity) ;
        });
    });

    test('Negative Case: [401] Get List POI with Invalid Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getListPoiWithInvalidToken(request);
        const responseData = await response.json();

        expect(response.status()).toBe(401);
        expect(responseData.message).toBe("access token expired or in invalid format");
    });

    test('Negative Case: [401] Get List POI Without Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getListPoiWithoutToken(request);
        const responseData = await response.json();

        expect(response.status()).toBe(401);
        expect(responseData.message).toBe("required authorization headers");
    });
});
