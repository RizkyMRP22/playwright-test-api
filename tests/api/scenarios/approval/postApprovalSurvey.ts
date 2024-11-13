import { test, expect, APIRequestContext } from '@playwright/test';
import { postApprovalMGR } from '../../endpoints/approval/postApprovalSurveyHOTD';

interface IPayload {
    action: string;
    email: string;
    id: string;
    poiId: string;
}

export async function approveSurveyStep(request: APIRequestContext,loginToken:string, info: IPayload) {
    const payload = {
        action: info.action,
        email: info.email,
        id: info.id,
    };
    const response = await postApprovalMGR(request, loginToken, payload);
    const responseData = await response.json();
    expect.soft(responseData.message, `Expected POI "${info.poiId}" to be successfully Approve`).toBe("berhasil mengirim data");
}