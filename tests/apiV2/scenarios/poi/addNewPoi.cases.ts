import { APIRequestContext } from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api'
import BaseTestCase from '../../../../helpers/baseTestCase';

class AddNewPoiCases extends BaseTestCase {
    static async postAddNewPoi(request: APIRequestContext, loginToken: string, payload: any): Promise<any> {
        const response = await PoiEndpoints.postAddNewPOI(request, loginToken, payload);
        const responseData = await response.json();

        this.assertCompare([
            {
                message: 'Expected response code is 201',
                actual: responseData.code,
                expected: 201,
                useSoft: true
            },
            {
                message: 'Expected message is "berhasil mengirim data"',
                actual: responseData.message,
                expected: 'berhasil mengirim data',
                useSoft: true
            },
        ], responseData);

        this.assertDefined([
            {
                message: 'Expected idPoi is defined',
                actual: responseData.data.idPoi,
                useSoft: true
            }
        ], responseData);

        return responseData;
    };
}

export default AddNewPoiCases;