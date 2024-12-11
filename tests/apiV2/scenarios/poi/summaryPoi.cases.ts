import { APIRequestContext } from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api'
import Constants from '../../../../helpers/constants';
import { getDataFaker } from '../../../../helpers/faker';
import BaseTestCase from '../../../../helpers/baseTestCase';

class SummaryPoiCases extends BaseTestCase {
    static async getSummaryPOI(request: APIRequestContext, loginToken: string): Promise<any> {
        const response = await PoiEndpoints.getSummaryPoi(request, loginToken);
        const responseData = await response.json();

        const actualKeys = Object.keys(responseData.data);
        const unexpectedKeys = Constants.expectedLabelStatus.filter(label => !actualKeys.includes(label));
        const missingKeys = actualKeys.filter(key => !Constants.expectedLabelStatus.includes(key));

        if (missingKeys.length > 0 || unexpectedKeys.length > 0) {
            if (missingKeys.length > 0) {
                this.assertCompare([
                    {
                        message: 'Expected no have missing keys',
                        actual: missingKeys.length,
                        expected: 0,
                        useSoft: true
                    }
                ], responseData);
                console.info("Missing Keys: ", missingKeys);
            }
            if (unexpectedKeys.length > 0) {
                this.assertCompare([
                    {
                        message: 'Expected no have unexpected keys',
                        actual: unexpectedKeys.length,
                        expected: 0,
                        useSoft: true
                    }
                ], responseData);
                console.info("Unexpected Keys: ", unexpectedKeys);
            }
        }

        this.assertCompare([
            {
                message: 'Expected response code is 200',
                actual: responseData.code,
                expected: 200,
                useSoft: true,
            },
            {
                message: 'Expected message is "Berhasil menampilkan data summary POI"',
                actual: responseData.message,
                expected: 'success',
                useSoft: true,
            },
            {
                message: 'Expected meta.source is "MyIndibiz Assistant"',
                actual: responseData.meta.source,
                expected: 'MyIndibiz Assistant',
                useSoft: true,
            }
        ],
            responseData
        );

        return responseData;

    };

    static async getSummaryPOIWithInvalidToken(request: APIRequestContext): Promise<any> {
        const invalidToken = getDataFaker().invalidToken
        const response = await PoiEndpoints.getSummaryPoi(request, invalidToken);
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

export default SummaryPoiCases;