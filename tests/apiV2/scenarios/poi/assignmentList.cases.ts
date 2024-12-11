import { APIRequestContext } from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api';
import BaseTestCase from '../../../../helpers/baseTestCase';

class AssignmentPoiList extends BaseTestCase {

    static async getAssignmentPoiList(request: APIRequestContext, loginToken: string, params?: any): Promise<any> {
        const response = await PoiEndpoints.getAssignmentPoiList(request, loginToken, params);
        const responseData = await response.json();

        this.assertCompare([
            {
                message: 'Expected response code is 200',
                actual: responseData.code,
                expected: 200,
                useSoft: true
            },
            {
                message: 'Expected message is "Success"',
                actual: responseData.message,
                expected: 'Success',
                useSoft: true
            },
            {
                message: 'Expected status is "Valid"',
                actual: responseData.data[0].status.label,
                expected: 'Valid',
                useSoft: true
            }
        ], responseData);

        return responseData;
    }
}

export default AssignmentPoiList;