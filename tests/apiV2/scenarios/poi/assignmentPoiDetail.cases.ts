import { APIRequestContext } from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api'
import { getDataFaker } from '../../../../helpers/faker';
import BaseTestCase from '../../../../helpers/baseTestCase';

class AssignmentPoiDetailCases extends BaseTestCase {
    static async getAssignmentPoiDetail(request: APIRequestContext, loginToken: string, idPoi: string, payload?: any): Promise<any> {
        const response = await PoiEndpoints.getAssignmentPoiDetail(request, loginToken, idPoi);
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
                message: `Expected ID POI ${idPoi} Match`,
                actual: responseData.data.poi.poiId,
                expected: Number(idPoi),
                useSoft: true
            },
            {
                message: `Expected status is Proses Survey`,
                actual: responseData.data.label.poiStatus.label,
                expected: "Proses Survey",
                useSoft: true
            },
            {
                message: `Expected information source is MyTens`,
                actual: responseData.data.poi.source,
                expected: "MyTEnS",
                useSoft: true
            }
        ], responseData);

        if (payload) {
            this.assertCompare([
                {
                    message: `Expected address match with request`,
                    actual: responseData.data.poi.address,
                    expected: payload.address,
                    useSoft: true
                },
                {
                    message: `Expected Longitude match with request`,
                    actual: responseData.data.poi.longitude,
                    expected: payload.longitude,
                    useSoft: true
                },
                {
                    message: `Expected Latitude match with request`,
                    actual: responseData.data.poi.latitude,
                    expected: payload.latitude,
                    useSoft: true
                }
            ], responseData);
        }
        return responseData;
    };

    static async getAssignmentPoiDetailWithInvalidToken(request: APIRequestContext, idPoi: string): Promise<any> {
        const invalidToken = getDataFaker().invalidToken
        const response = await PoiEndpoints.getAssignmentPoiDetail(request, invalidToken, idPoi);
        const responseData = await response.json();

        this.assertCompare([
            {
                message: 'Expected response code is 401',
                actual: responseData.code,
                expected: 401,
                useSoft: true
            },
            {
                message: 'Expected message is "access token expired or in invalid format"',
                actual: responseData.message,
                expected: 'access token expired or in invalid format',
                useSoft: true
            }
        ], responseData);

        return responseData;
    };
}

export default AssignmentPoiDetailCases;