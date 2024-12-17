import { APIRequestContext, expect} from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api';
import BaseTestCase from '../../../../helpers/baseTestCase';
import { getStorage, saveStorageNew } from '../../../../helpers/parsingData';

class SubSectorCases extends BaseTestCase {
    static async getSubSector(request: APIRequestContext, loginToken: string, sectorIds?:number): Promise<any> {
        const getData = getStorage('business')
        const { sectorId } = getData;

        const response = await PoiEndpoints.getSubSectorList(request, loginToken);
        const responseData = await response.json();  

        this.logger("info","jumlah data subSector:",responseData.data.length)

        const filteredData = responseData.data.filter((item: { sectorId: number }) => item.sectorId === sectorId);
        let subSectorId: any;
        let actualSectorId: any;
        let suggestEcosystem: any;
        let subSectorName:any

        if (filteredData.length >= 1) {
            const randomIndex = Math.floor(Math.random() * filteredData.length);
            const selected = filteredData[randomIndex];
            subSectorId = selected.id;
            subSectorName = selected.name;
            actualSectorId= selected.sectorId
            suggestEcosystem = selected.ecosystem
            const payload = {
                actualSectorId,
                subSectorId,
                subSectorName,
                suggestEcosystem
            }
            saveStorageNew('business',payload)
        } else {
            console.warn('Expected more than 1 record but got:', filteredData.length);
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
            },
            {
                message: 'Expected sectorId request and response is valid',
                actual: actualSectorId,
                expected: sectorId,
                useSoft: true,
                strictEqual: true
            }
        ],responseData);

        return {subSectorId, suggestEcosystem};

    };

}

export default SubSectorCases;