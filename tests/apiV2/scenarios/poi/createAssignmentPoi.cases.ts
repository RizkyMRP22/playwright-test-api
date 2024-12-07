import { APIRequestContext } from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api'
import { getDataFaker } from '../../../../helpers/faker';
import BaseTestCase from '../../../../helpers/baseTestCase';

class CreateAssignmentPoi extends BaseTestCase {
    static async postAssignmentPoi(request: APIRequestContext, loginToken: string,payload: any): Promise<any> {
        const payloads = {
            idPoi: [Number(payload.poiId)],
            emailUserAgent: payload.emailUserAgent,
            assignTo: payload.assignTo,
            assignmentType: payload.assignmentType
        };

        const response = await PoiEndpoints.postAssignmentPoi(request, loginToken, payloads);
        const responseData = await response.json();

        this.assertCompare([
            {
                message: 'Expected response code is 201',
                actual: responseData.code,
                expected: 201,
                useSoft: true
            },
            {
                message: 'Expected message is "POI berhasil diassign"',
                actual: responseData.message,
                expected: 'POI berhasil diassign',
                useSoft: true
            },
        ], responseData);

        return responseData;
    };
}

export default CreateAssignmentPoi;