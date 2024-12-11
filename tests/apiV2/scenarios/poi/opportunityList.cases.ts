import { APIRequestContext, expect} from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api';
import BaseTestCase from '../../../../helpers/baseTestCase';
import Constants from '../../../../helpers/constants';
import { saveStorage, saveStorageNew } from '../../../../helpers/parsingData';

class OpportunityListCases extends BaseTestCase {
    static async getOpportunityList(request: APIRequestContext, loginToken: string): Promise<any> {
        const response = await PoiEndpoints.getOpportunities(request, loginToken);
        const responseData = await response.json();  
        const constant = Constants.expectedOpportunities

        let opportunityId: any;

        if (responseData.data.length >= 1) {
            const randomIndex = Math.floor(Math.random() * responseData.data.length);
            const selectedOpportunity = responseData.data[randomIndex];
            opportunityId = selectedOpportunity.id;
            saveStorageNew('business',{opportunityId})
        } else {
            console.warn('Expected more than 1 record but got:', responseData.data.length);
        }

        this.logger('info','opportunityId Selected', opportunityId)

        const simplifiedExpectedData = constant.map((opportunity: { id: number, name: string }) => ({
            id: opportunity.id,
            name: opportunity.name
        }));

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
            },
            {
                message: 'Expected data opportunity is valid"',
                actual: responseData.data,
                expected: simplifiedExpectedData,
                useSoft: true,
                strictEqual: true
            }
        ],responseData);

        return opportunityId;
    }
}

export default OpportunityListCases