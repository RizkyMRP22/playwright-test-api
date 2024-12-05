import { APIRequestContext } from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api'
import { getDataFaker } from '../../../../helpers/faker';
import BaseTestCase from '../../../../helpers/baseTestCase';

class DetailPoiCases extends BaseTestCase {
    static async getPoiDetail(request: APIRequestContext, loginToken: string, idPoi: string, payload?: any): Promise<any> {
        const response = await PoiEndpoints.getPoiDetail(request, loginToken, idPoi);
        const responseData = await response.json();

        this.assertCompare([
            {
                message: 'Expected response code is 200',
                actual: responseData.code,
                expected: 200,
                useSoft: true
            },
            {
                message: 'Expected message is "success"',
                actual: responseData.message,
                expected: 'success',
                useSoft: true
            },
            {
                message: `Expected ID POI ${idPoi} Match`,
                actual: responseData.data.idPoi,
                expected: Number(idPoi),
                useSoft: true
            },
            {
                message: `Expected assignBy is match with user created`,
                actual: responseData.data.assignBy,
                expected: "920194dummy",
                useSoft: true
            },
            {
                message: `Expected status is Proses Survey`,
                actual: responseData.data.status[0].label,
                expected: "Proses Survey",
                useSoft: true
            },
            {
                message: `Expected label chip source is MyTens`,
                actual: responseData.data.status[2].label,
                expected: "MyTEnS",
                useSoft: true
            },
            {
                message: `Expected information source is MyTens`,
                actual: responseData.data.information.source,
                expected: "MyTEnS",
                useSoft: true
            }
        ], responseData);

        if (payload) {
            this.assertCompare([
                {
                    message: `Expected address match with request`,
                    actual: responseData.data.information.address,
                    expected: payload.address,
                    useSoft: true
                },
                {
                    message: `Expected Longitude match with request`,
                    actual: responseData.data.information.long,
                    expected: payload.longitude.toString(),
                    useSoft: true
                },
                {
                    message: `Expected Latitude match with request`,
                    actual: responseData.data.information.lat,
                    expected: payload.latitude.toString(),
                    useSoft: true
                }
            ], responseData);
            return responseData;
        }
    };

    static async getPoiDetailWithInvalidToken(request: APIRequestContext, idPoi: string): Promise<any> {
        const invalidToken = getDataFaker().invalidToken
        const response = await PoiEndpoints.getPoiDetail(request, invalidToken, idPoi);
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

export default DetailPoiCases;