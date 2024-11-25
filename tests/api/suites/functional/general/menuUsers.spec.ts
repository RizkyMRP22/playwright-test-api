import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../../endpoints/auth/postLogin';
import { getMenuUser } from '../../../endpoints/general/getMenuUser';
import { getMenuBO } from '../../../endpoints/general/getMenuBO';
import { compareMenuFields, getStorage } from '../../../../../helpers/parsingData';
import dotenv from 'dotenv';
dotenv.config();

test.describe(`[${process.env.ENV}] Compare Menu from API User Management and BO`, () => {

    const data = require('../../../../../assets/json/dataUsers.localStorage.json');
    const dataUsers = data.dataUsers

    for (const data of dataUsers) {
        test.skip(`Compare Menu ${data.role}`, async ({ request }: { request: APIRequestContext }) => {
            const nik = data.nik;
            const logins = await login(request, nik, data.password);
            const responseLogin = await logins.json();
            const loginToken = responseLogin.data.accessToken;
        
            const getMenuUsers = await getMenuUser(request, loginToken);
            const responseMenuUser = await getMenuUsers.json();
            const getMenuBOs = await getMenuBO(request, loginToken);
            const responseMenuBO = await getMenuBOs.json();
        
            const mismatchedEntries = await compareMenuFields(responseMenuUser, responseMenuBO);
            if (mismatchedEntries.length > 0) {
                throw new Error('Menu comparison failed. Check logs for mismatched entries.');
            }
        });
    }
    
});
