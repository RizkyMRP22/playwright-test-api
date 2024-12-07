import { APIRequestContext } from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api'
import BaseTestCase from '../../../../helpers/baseTestCase';
import { saveStorage } from '../../../../helpers/parsingData';

interface Params {
    page: number;
    size: number;
    sortBy?: string;
    validBy?: string;
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

class ListSurveyPoiCases extends BaseTestCase {
    static async getListSurveyPoi(request: APIRequestContext, loginToken: string, params?: Params, poiId?:any): Promise<any> {
        const queryParams: { [key: string]: string | number | boolean } = {
            ...params,
            ...(params?.startDateSurvey ? { startDateSurvey: params.startDateSurvey.toISOString() } : {}),
            ...(params?.endDateSurvey ? { endDateSurvey: params.endDateSurvey.toISOString() } : {})
        } as { [key: string]: string | number | boolean };
        
        const response = await PoiEndpoints.getSurveyList(request, loginToken, queryParams);
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

        if (poiId) {
            const isIdPoiPresent = responseData.data.some((poi:any) => poi.idPoi === Number(poiId));
            console.log(isIdPoiPresent)
        }

        this.assertDefined([
            {
                message: 'Expected meta.lastUpdate is defined',
                actual: responseData.meta.lastUpdate,
                useSoft: true
            }
        ], responseData);

        return response;
    }
}

export default ListSurveyPoiCases;