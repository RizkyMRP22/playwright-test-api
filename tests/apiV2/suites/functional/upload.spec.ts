import { test } from '@playwright/test';
import LoginCases from '../../scenarios/auth/login.cases';
import UploadImagesCases from '../../scenarios/poi/uploadImages.cases';


test.describe('Upload Images', () => {
    test('HOTD can create profiling POI', async ({ request }) => { 
        const responseLogin = await LoginCases.validLogin(request);
        const loginToken = responseLogin.data.accessToken;
        const poiId = '10224686';
        
        const response = await UploadImagesCases.postEvidence(request, loginToken, poiId);
        console.log('response: ', response);
        
    })
});
