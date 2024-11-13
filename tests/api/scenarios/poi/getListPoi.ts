import { test, expect, APIRequestContext } from '@playwright/test';
import { getListPoi, getListPoiWithInvalidToken, getListPoiWithoutToken, getListPoiNotValid } from '../../endpoints/poi/getListPoi';
import { getStorage, saveStorage } from '../../../../helpers/parsingData';
import { ECOSYSTEM_DATA, expectedColors, expectedStatus, expectedOpportunities } from '../../../../helpers/constants';

export async function getPoiList (request: APIRequestContext, loginToken: string, params: any) {
    const response = await getListPoi(request, loginToken, params);
    const responseData = await response.json();
    expect.soft(response.ok(), 'Expected response API is valid').toBeTruthy();
    expect.soft(responseData.code, 'Expected response code is 200').toBe(200);
    expect.soft(responseData.message, 'Expected message is "success"').toBe("success");
    // expect.soft(responseData.meta.page, 'Expected meta.page is  1').toBe(1);
    // expect.soft(responseData.meta.size, 'Expected meta.size is 10').toBe(10);
    expect.soft(responseData.meta.source, 'Expected meta.source is "MyIndibiz Assistant"').toBe("MyIndibiz Assistant");
    expect.soft(responseData.meta.lastUpdate, 'Expected meta.lastUpdate is defined').toBeDefined();

    responseData.data.forEach((poi: { idPoi: any }) => {
        const dataType = 'number';
        expect.soft(typeof poi.idPoi, `Expected poi id is ${dataType}`).toBe(dataType);
        saveStorage("poiId", poi.idPoi);
    });

    return responseData;
};