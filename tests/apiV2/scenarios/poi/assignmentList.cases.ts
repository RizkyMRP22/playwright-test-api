import { APIRequestContext, expect } from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api';
import BaseTestCase from '../../../../helpers/baseTestCase';
import { getStorage } from '../../../../helpers/parsingData';

class AssignmentPoiList extends BaseTestCase {

    static async getAssignmentPoiList(request: APIRequestContext, loginToken: string, poiId?:any, params?: any): Promise<any> {
        const getData = await JSON.parse(getStorage('poiDetail-e2e'))
        const poiName = getData.name

        const payload = {
            search: poiName
        }
        
        const response = await PoiEndpoints.getAssignmentPoiList(request, loginToken, payload ?? params);
        const responseData = await response.json();

        if (poiId) {
            const isIdPoiPresent = responseData.data.some((poi: any) => poi.id === Number(poiId));

            this.assertCompare([
                {
                    message: `Expected POI ID: ${poiId} is show in list`,
                    actual: isIdPoiPresent,
                    expected:true,
                    useSoft: true
                },
                {
                    message: `Expected POI Name: ${poiName} is show in list`,
                    actual: responseData.data[0].name,
                    expected:poiName,
                    useSoft: true
                }
            ], responseData);
        }

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
            // {
            //     message: 'Expected status is "Valid"',
            //     actual: responseData.data[0].status.label,
            //     expected: 'Valid',
            //     useSoft: true
            // }
        ], responseData);

        return responseData;
    }
}

export default AssignmentPoiList;