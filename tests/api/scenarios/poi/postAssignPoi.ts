import { test, expect, APIRequestContext } from '@playwright/test';
import { login } from '../../endpoints/auth/postLogin';
import { getListPoi } from '../../endpoints/poi/getListPoi';
import { postAssignPoiHOTD, postAssignPoiHOTDWithInvalidToken, postAssignPoiHOTDWithoutToken } from '../../endpoints/poi/postAssignPoi';
import { getStorage, saveStorage } from '../../../../helpers/parsingData';

export async function postAssignPoiHOTDs (request: APIRequestContext, loginToken: string, info: any) {
    const payload = {
        poiId:info.poiId,
        emailUserAgent: info.email,
        assignTo: "HOTD",
        assignmentType: "validasi"
    };

    console.log('payload', payload);

    const responseAssign = await postAssignPoiHOTD(request, loginToken, payload);
    const responseDataAssign = await responseAssign.json();

    expect.soft(responseDataAssign.message, `Expected POI "${info.poiId}" to be successfully assigned`).toBe("POI berhasil diassign");
}