import { APIRequestContext } from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api'
import BaseTestCase from '../../../../helpers/baseTestCase';

class ApprovalSurveyPoiCases extends BaseTestCase{
    static async postApprovalSurvey (request: APIRequestContext, loginToken: string, info: any): Promise<any> {
        const payload = {
            action: info.action,
            email: info.email,
            id: Number(info.poiId)
        };

        const response = await PoiEndpoints.postApprovalSurvey(request, loginToken, payload);
        const responseData = await response.json();
        this.assertCompare([
            {
                message: `expected message is "berhasil mengirim data"`,
                actual: responseData.message,
                expected: 'berhasil mengirim data',
                useSoft: true
            }
        ], responseData);
    };
}

export default ApprovalSurveyPoiCases;