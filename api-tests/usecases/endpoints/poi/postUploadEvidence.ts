import { APIRequestContext, APIResponse } from '@playwright/test';
import * as fs from 'fs';
import path from 'path';

export const postUploadEvidence = async (
    request: APIRequestContext,
    loginToken: string,
    infoPoi: string,
): Promise<APIResponse> => {
    const poiId = Number(infoPoi);
    const type = 'respondent';

    const filePath = path.join(__dirname, '../../../localStorage/background diponogoro.jpeg');
    const fileBuffer = fs.readFileSync(filePath);

    const formData = {
        photo: {
            name: path.basename(filePath),
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
