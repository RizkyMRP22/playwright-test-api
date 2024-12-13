import { APIRequestContext } from '@playwright/test';
import { PoiEndpoints } from '../../endpoints/poi.api'
import BaseTestCase from '../../../../helpers/baseTestCase';
import PayloadRequest from '../../../../helpers/generatePayload';
import { getStorage, saveStorage, saveStorageNew } from '../../../../helpers/parsingData';

class AddNewPoiCases extends BaseTestCase {
    static async postAddNewPoi(request: APIRequestContext, loginToken: string, payload: any): Promise<any> {
        const getData = getStorage('business')
        const { sectorId, subSectorId, opportunityId, suggestEcosystem, selectedEcosystem, sectorName, subSectorName, opportunityName } = getData;

        const payloads = {
            photo: payload.photo,
            ecosystem: suggestEcosystem ?? selectedEcosystem,
            sectorId: sectorId,
            subSectorId: subSectorId,
            opportunityId: opportunityId,
            sectorName: sectorName,
            subSectorName:subSectorName,
            opportunityName: opportunityName
        }

        const data = PayloadRequest.addNewPoi(payload ?? payloads)
        this.logger('info',"payload", data)
        saveStorage('payload-addNewPoi', {data,getData})
        const response = await PoiEndpoints.postAddNewPOI(request, loginToken, data);
        const responseData = await response.json();
        const res = responseData.data

        saveStorageNew('payload-addNewPoi', {res})

        this.logger("info","hasil response add new: ", responseData.data)

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
            {
                message: 'Expected message is "berhasil mengirim data"',
                actual: responseData.message,
                expected: 'berhasil mengirim data',
                useSoft: true
            }
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