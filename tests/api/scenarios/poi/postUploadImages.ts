import { APIRequestContext, APIResponse } from '@playwright/test';
import { getFileUpload } from '../../../../helpers/parsingData';

const filename = 'background_diponogoro.jpeg';
const fileBuffer = getFileUpload(filename, 'images');

export const postUploadImages = async (
    request: APIRequestContext,
    loginToken: string,
): Promise<APIResponse> => {

    if (!fileBuffer) {
        throw new Error(`File ${filename} could not be found or read.`);
    }

    const formData = {
        file: {
            name: filename,
            mimeType: 'image/jpeg',
            buffer: fileBuffer
        },
        path:"image"
    };
    
    const response = await request.post('/business-owner/v1/general/upload', {
        headers: {
            'Authorization': `Bearer ${loginToken}`,
        },
        multipart: formData
    });
    return response;
};
