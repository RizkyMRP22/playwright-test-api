import { APIRequestContext } from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api';
import { saveStorage } from '../../../../helpers/parsingData';
import BaseTestCase from '../../../../helpers/baseTestCase';

class UploadImagesCases extends BaseTestCase {
    static async postUploadImages(request: APIRequestContext, loginToken: string, filename?: string): Promise<any> {
        const filenames = 'background_diponogoro.jpeg';
        const response = await PoiEndpoints.postUploadImages(request, loginToken, filename ?? filenames);
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

    static async postUploadEvidence(request: APIRequestContext, loginToken: string, poiId:string, filename?: string): Promise<any> {
        const filenames = 'background_diponogoro.jpeg';
        const maxRetries = 5;
        let retryCount = 0;
        let responseUploadEvidence:any;
        let responseDataUploadEvidence:any;

        while (retryCount < maxRetries) {
            responseUploadEvidence = await PoiEndpoints.postUploadEvidence(request, loginToken,filename ?? filenames,poiId);
            if (responseUploadEvidence.ok()) {
                responseDataUploadEvidence = await responseUploadEvidence.json();
                saveStorage("evidence-upload", JSON.stringify(responseDataUploadEvidence.data));
                break;
            } else {
                retryCount++;
                console.log(`Retrying Upload Evidence... Attempt ${retryCount}`);
            }
        }

        this.assertCompare([
            {
                message: 'Expected response code is 200',
                actual: responseDataUploadEvidence.code,
                expected: 200,
                useSoft: true
            },
            {
                message: 'Expected message is "berhasil upload file"',
                actual: responseDataUploadEvidence.message,
                expected: 'Success',
                useSoft: true
            }
        ], responseDataUploadEvidence);

        this.assertDefined([
            {
                message: 'Expected url is defined ',
                actual: responseDataUploadEvidence.data.mysiisPhotoId,
                useSoft: true
            },
            {
                message: 'Expected path is defined ',
                actual: responseDataUploadEvidence.data.pathUrl,
                useSoft: true
            }
        ], responseDataUploadEvidence);
        return responseDataUploadEvidence;
    };

    static async postEvidence(request: APIRequestContext, loginToken: string, poiId:string, filename?: string): Promise<any> {
        const filenames = 'background_diponogoro.jpeg';
        const payload = {
            poiId: poiId,
            type: 'response',
            filename: filename ?? filenames
        }

        const maxRetries = 5;
        let retryCount = 0;
        let responseUploadEvidence:any;
        let responseDataUploadEvidence:any;

        while (retryCount < maxRetries) {
            responseUploadEvidence = await PoiEndpoints.postEvidence(request, loginToken,payload);
            if (responseUploadEvidence.ok()) {
                responseDataUploadEvidence = await responseUploadEvidence.json();
                saveStorage("evidence-upload", JSON.stringify(responseDataUploadEvidence.data));
                break;
            } else {
                retryCount++;
                console.log(`Retrying Upload Evidence... Attempt ${retryCount}`);
            }
        }

        this.assertCompare([
            {
                message: 'Expected response code is 200',
                actual: responseDataUploadEvidence.code,
                expected: 200,
                useSoft: true
            },
            {
                message: 'Expected message is "berhasil upload file"',
                actual: responseDataUploadEvidence.message,
                expected: 'Success',
                useSoft: true
            }
        ], responseDataUploadEvidence);

        this.assertDefined([
            {
                message: 'Expected url is defined ',
                actual: responseDataUploadEvidence.data.mysiisPhotoId,
                useSoft: true
            },
            {
                message: 'Expected path is defined ',
                actual: responseDataUploadEvidence.data.pathUrl,
                useSoft: true
            },            
            {
                message: 'Expected fileId is defined ',
                actual: responseDataUploadEvidence.data.fileId,
                useSoft: true
            },
            {
                message: 'Expected fileName is defined ',
                actual: responseDataUploadEvidence.data.fileName,
                useSoft: true
            }

        ], responseDataUploadEvidence);
        return responseDataUploadEvidence;
    };
}

export default UploadImagesCases;