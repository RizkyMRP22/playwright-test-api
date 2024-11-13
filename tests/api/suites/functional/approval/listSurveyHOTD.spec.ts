import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getListSurvey, getListSurveyWithInvalidToken, getListSurveyWithoutToken } from '../../../endpoints/approval/getListSurvey';
import { saveStorage } from '../../../../../helpers/parsingData';

test.describe('API GET List Hasil Survey By MGR Witel', () => {
    let loginToken: string;
    let nikUsers: string;

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const nik = "850162dummy";
        const response = await login(request, nik);
        const responseData = await response.json();

        expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code is 200').toBe(200);
        expect.soft(responseData.message, 'Expected message is "Your Request Has Been Processed"').toBe("Your Request Has Been Processed");

        loginToken = responseData.data.accessToken;
        nikUsers = responseData.data.nik;
    });

    test(`Positive Case:[200] Get List Hasil Survey with status Valid Internal`, async ({ request }: { request: APIRequestContext }) => {
        const payload = {
            page: 1,
            size: 10,
            sortBy: "createdDate",
        };
        const response = await getListSurvey(request, loginToken, payload);
        const responseData = await response.json();

        expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
        expect.soft(responseData.code, 'Expected response code is 200').toBe(200);
        expect.soft(responseData.message, 'Expected message is "Success"').toBe("success");

        responseData.data.forEach((data: { validBy: any, status: { label: any } }) => {
            const status = 'Proses Approval - Valid Internal';
            const validBy = 'HOTD';
            expect.soft(data.status[0].label, `Expected Status to match ${status}`).toBe(status);
            expect.soft(data.validBy, `Expected validBy to match ${validBy}`).toBe(validBy);
        });
        saveStorage("poi-survey", JSON.stringify(responseData.data[1]));
    });

    test('Negative Case: [401] Get List Hasil Survey with Invalid Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getListSurveyWithInvalidToken(request);
        const responseData = await response.json();

        expect.soft(responseData.code, 'Expected response code is 401').toBe(401);
        expect.soft(responseData.message, 'Expected message is "access token expired or in invalid format"').toBe("access token expired or in invalid format");
    });

    test('Negative Case: [401] Get List Hasil Survey Without Token', async ({ request }: { request: APIRequestContext }) => {
        const response = await getListSurveyWithoutToken(request);
        const responseData = await response.json();

        expect.soft(responseData.code, 'Expected response code is 401').toBe(401);
        expect.soft(responseData.message, 'Expected message is "required authorization headers"').toBe("required authorization headers");
    });
});
