import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { postLead } from '../../../endpoints/lms-external/postSubmitLead';
import { getLeadDetail } from '../../../endpoints/lms-dashboard/getLeadDetail';
import { putLeadProgress } from '../../../endpoints/lms-dashboard/putLeadProgress';
import { getPotentialLead } from '../../../endpoints/lead/getPotentialLead';
import { postSubmitLead } from '../../../scenarios/lms-external/postSubmitLead'

test.describe.serial('[E2E] Create lead from external source and dispatch to MGR Witel', () => {

    let loginToken: string;
    let leadId: string;
    let isCompleted: boolean = true;
    let managerWitel:string;

    test.beforeAll(async ({ request }: { request: APIRequestContext }) => {
        const dataUser = {
            nik: process.env.NIK_SDA,
            password: process.env.PASSWORD_DEFAULT
        }
        const response = await login(request, dataUser.nik, dataUser.password);
        const responseData = await response.json();

        expect(response.ok()).toBeTruthy();
        loginToken = responseData.data.accessToken;
    });

    test('Post LEAD from External Source', async ({ request }: { request: APIRequestContext }) => {
        const response = await postSubmitLead(request);
        leadId = response.data.leadId
        console.log("leadId: ", leadId)
    });

    test('Get LEAD detail', async ({ request }: { request: APIRequestContext }) => {
        const response = await getLeadDetail(request, loginToken, leadId);
        expect.soft(response.ok(), 'Expected response API to be valid').toBeTruthy();

        const responseData = await response.json();
        leadId = responseData.data.leadId
        isCompleted = responseData.data.isCompleted
        console.log("leadId: ", leadId)
        console.log("isCompleted: ", isCompleted)
    });

    if (!isCompleted) {
        throw new Error('Lead is not complete');
    } else {
        test('Dispatch LEAD Progress to MGR Witel', async ({ request }: { request: APIRequestContext }) => {
            const response = await putLeadProgress(request, loginToken, leadId);
            expect.soft(response.ok(), 'Expected response API to be valid').toBeTruthy();

            const responseData = await response.json();
            const message = responseData.message
            console.log("message: ", message)
        });

        test('Get LEAD detail for get MGR Witel data', async ({ request }: { request: APIRequestContext }) => {
            const response = await getLeadDetail(request, loginToken, leadId);
            expect.soft(response.ok(), 'Expected response API to be valid').toBeTruthy();

            const responseData = await response.json();
            leadId = responseData.data.leadId
            managerWitel = responseData.data.managerWitel.nik
            console.log("leadId: ", leadId)
            console.log("managerWitel: ", managerWitel)
        });
        
        test('Get Potential Lead in MGR Witel MyTens', async ({ request }: { request: APIRequestContext }) => {
            const dataUser = {
                nik: managerWitel,
                password: process.env.PASSWORD_DEFAULT
            }
            const loginResponse = await login(request, dataUser.nik, dataUser.password);
            const responseDataLogin = await loginResponse.json();
    
            expect(loginResponse.ok()).toBeTruthy();
            loginToken = responseDataLogin.data.accessToken;

            const response = await getPotentialLead(request, loginToken);
            expect.soft(response.ok(), 'Expected response API to be valid').toBeTruthy();

            const responseData = await response.json();
            const lead = responseData.data.find((data: { leadId: string }) => data.leadId === leadId);
            if (lead) {
                console.log("Lead found: ", lead);
            } else {
                throw new Error('Lead is not found');
            }
        });
    }
});