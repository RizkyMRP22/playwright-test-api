import { APIRequestContext, APIResponse } from '@playwright/test';
import { getFileUpload } from '../../../../helpers/parsingData';

const filename = 'background_diponogoro.jpeg';
const fileBuffer = getFileUpload(filename, 'images');

export const postUploadEvidence = async (
    request: APIRequestContext,
    loginToken: string,
    infoPoi: string,
): Promise<APIResponse> => {
    const poiId = Number(infoPoi);
    const type = 'respondent';

    if (!fileBuffer) {
        throw new Error(`File ${filename} could not be found or read.`);
    }

    const formData = {
        photo: {
            name: filename,
            mimeType: 'image/jpeg',
            buffer: fileBuffer
        },
        poiId: poiId,
        type: type
    };

    const response = await request.post('/business-owner/v2/hero/poi/assignment/upload', {
        headers: {
            'Authorization': `Bearer ${loginToken}`,
        },
        multipart: formData
    });
    return response;
};
