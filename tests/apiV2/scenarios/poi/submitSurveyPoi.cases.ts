import { APIRequestContext } from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api';
import PayloadRequest from '../../../../helpers/generatePayload';
import BaseTestCase from '../../../../helpers/baseTestCase';
import { getStorage } from '../../../../helpers/parsingData';

class SubmitSurveyPoiCases extends BaseTestCase {
    static async submitSurveyPoi(request: APIRequestContext, loginToken: string ): Promise<any> {
        const payload = JSON.parse(getStorage('poiDetail-e2e'));
        const infoEvidence = JSON.parse(getStorage("evidence-upload"));
        const payloads = {
            poiId: payload.idPoi,
            poiName: payload.name,
            sector: payload.segment.sector,
            subSector: payload.segment.subSector,
            latitude: payload.lat,
            longitude: payload.long,
            opportunity: payload.segment.opportunity,
            address: payload.address,
            photo: infoEvidence.pathUrl,
            fileName: infoEvidence.fileName,
            fileId: infoEvidence.fileId,
        };
        const data = PayloadRequest.submitSurveyPoi(payloads)
        const response = await PoiEndpoints.postSubmitSurvey(request, loginToken, data);
        const responseData = await response.json();

        this.assertCompare([
            {
                message: 'Expected response code is 200',
                actual: responseData.code,
                expected: 200,
                useSoft: true,
            },
            {
                message: 'Expected message is "Berhasil submit survey POI"',
                actual: responseData.message,
                expected: 'Success',
                useSoft: true,
            }
        ], responseData);

    };
};

export default SubmitSurveyPoiCases;