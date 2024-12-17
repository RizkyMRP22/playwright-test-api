import { APIRequestContext, expect} from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api';
import BaseTestCase from '../../../../helpers/baseTestCase';
import Constants from '../../../../helpers/constants';
import { getStorage, saveStorageNew } from '../../../../helpers/parsingData';

class SectorListCases extends BaseTestCase {
    static async getSectorList(request: APIRequestContext, loginToken: string, opportunityIds?: number): Promise<any> {
        const getData = getStorage('business')
        const { opportunityId } = getData;
        
        const queryParams: { [key: string]: string | number | boolean } = {
            opportunityId: opportunityId
        } as { [key: string]: string | number | boolean };

        const response = await PoiEndpoints.getSectorList(request, loginToken, queryParams);
        const responseData = await response.json();  

        this.logger("info","jumlah data sector:",responseData.data.length)

        const constant = Constants.expectedOpportunities

        let sectorId: any;
        let sectorName:any;

        if (responseData.data.length >= 1) {
            const randomIndex = Math.floor(Math.random() * responseData.data.length);
            const selected = responseData.data[randomIndex];
            sectorId = selected.id;
            sectorName = selected.name
            const payload={
                sectorId,
                sectorName
            }
            saveStorageNew('business',payload)
        } else {
            console.warn('Expected more than 1 record but got:', responseData.data.length);
        }

        const simplifiedExpectedData = constant
        .filter((opportunity: { id: number; sector: { id: number; name: string; opportunityId: number }[] }) =>
          opportunity.id === opportunityId
        )
        .flatMap((opportunity: { sector: { id: number; name: string; opportunityId: number }[] }) =>
          opportunity.sector.map((sector) => ({
            id: sector.id,
            name: sector.name,
            opportunityId: sector.opportunityId,
          }))
        );
        
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
                message: 'Expected Sector list is valid',
                actual: responseData.data,
                expected: simplifiedExpectedData,
                useSoft: true,
                strictEqual: true
            }
        ],responseData);

        return sectorId
    }
}

export default SectorListCases;