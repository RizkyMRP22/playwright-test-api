import { APIRequestContext } from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api'
import { getDataFaker } from '../../../../helpers/faker';
import BaseTestCase from '../../../../helpers/baseTestCase';

class UploadImagesCases extends BaseTestCase {
    static async postUploadImages(request: APIRequestContext, loginToken: string, filename: string): Promise<any> {
        const response = await PoiEndpoints.postUploadImages(request, loginToken, filename);
        const responseData = await response.json();

        this.assertCompare([
            {
                message: 'Expected response code is 200',
                actual: responseData.code,
                expected: 200,
                useSoft: true
            },
            {
                message: 'Expected message is "berhasil upload file"',
                actual: responseData.message,
                expected: 'berhasil upload file',
                useSoft: true
            }
        ], responseData);

        this.assertDefined([
            {
                message: 'Expected url is defined ',
                actual: responseData.data.url,
                useSoft: true
            },
            {
                message: 'Expected path is defined ',
                actual: responseData.data.path,
                useSoft: true
            }
        ], responseData);
        return responseData;
    };
}

export default UploadImagesCases;