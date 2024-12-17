import { APIRequestContext } from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api';
import BaseTestCase from '../../../../helpers/baseTestCase';
import { saveStorageNew } from '../../../../helpers/parsingData';

class EcosystemListCases extends BaseTestCase {
    static async getEcosystemList(request: APIRequestContext, loginToken: string): Promise<any> {
        const response = await PoiEndpoints.getEcosystemList(request, loginToken);
        const responseData = await response.json();  

        let selectedEcosystem: any;

        if (responseData.data.length >= 1) {
            const randomIndex = Math.floor(Math.random() * responseData.data.length);
            const selected = responseData.data[randomIndex];
            selectedEcosystem = selected.name;
            saveStorageNew('business',{selectedEcosystem})
        } else {
            console.warn('Expected more than 1 record but got:', responseData.data.length);
        }
        
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
                expected: 'Success',
                useSoft: true
            }
        ],responseData);

        return selectedEcosystem;
    }
}

export default EcosystemListCases;