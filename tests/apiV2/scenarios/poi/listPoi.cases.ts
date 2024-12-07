import { APIRequestContext } from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api'
import BaseTestCase from '../../../../helpers/baseTestCase';
import { saveStorage } from '../../../../helpers/parsingData';

interface Params {
    page: number;
    size: number;
    sort: string;
    status?: string;
    opportunity?: string;
    subSector?: string;
    search?: string;
    witel?: string;
    sto?: string;
    ecosystem?: string;
    source?: string;
    startDateSurvey?: Date;
    endDateSurvey?: Date;
}

class listPoiCases extends BaseTestCase {
    static async getListPoi(request: APIRequestContext, loginToken: string, params: any): Promise<any> {
        const queryParams: { [key: string]: string | number | boolean } = {
            ...params,
            ...(params.startDateSurvey ? { startDateSurvey: params.startDateSurvey.toISOString() } : {}),
            ...(params.endDateSurvey ? { endDateSurvey: params.endDateSurvey.toISOString() } : {})
        } as { [key: string]: string | number | boolean };
        
        const response = await PoiEndpoints.getPoiList(request, loginToken, queryParams);
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
                message: 'Expected meta.source is "MyIndibiz Assistant"',
                actual: responseData.meta.source,
                expected: 'MyIndibiz Assistant',
                useSoft: true
            }
        ], responseData);

        this.assertDefined([
            {
                message: 'Expected meta.lastUpdate is defined',
                actual: responseData.meta.lastUpdate,
                useSoft: true
            }
        ], responseData);

        let poiId: any;

        if (responseData.data.length > 1) {
            const randomIndex = Math.floor(Math.random() * responseData.data.length);
            const selectedPoi = responseData.data[randomIndex];
            poiId = selectedPoi.idPoi;
            saveStorage('poiId', poiId);
            saveStorage('poiDetail-e2e', JSON.stringify(selectedPoi));
        } else {
            console.warn('Expected more than 1 record but got:', responseData.data.length);
        }

        return poiId;
    }


}

export default listPoiCases;