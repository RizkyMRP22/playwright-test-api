import { APIRequestContext, APIResponse } from '@playwright/test';
import fs from 'fs';
import path from 'path';

export const postUploadEvidence = async (request: APIRequestContext, loginToken: string, infoPoi: string): Promise<APIResponse> => {
    const photoPath = path.join(__dirname, '../../../localStorage/background diponogoro.jpeg');
    const poiId = infoPoi;
    const type = 'respondent';

    // Read the file as a buffer
    const fileBuffer = fs.readFileSync(photoPath);

    // Define the boundary for multipart form-data
    const boundary = `----WebKitFormBoundary${Date.now().toString(16)}`;

    // Construct the multipart/form-data body manually, converting each part to Buffer
    const body = [
        Buffer.from(`--${boundary}\r\n`),
        Buffer.from(`Content-Disposition: form-data; name="photo"; filename="background_diponogoro.jpeg"\r\n`),
        Buffer.from(`Content-Type: image/jpeg\r\n\r\n`),  // Adjust if the file is a different type
        fileBuffer,
        Buffer.from(`\r\n--${boundary}\r\n`),
        Buffer.from(`Content-Disposition: form-data; name="poiId"\r\n\r\n`),
        Buffer.from(`${poiId}\r\n`),
        Buffer.from(`--${boundary}\r\n`),
        Buffer.from(`Content-Disposition: form-data; name="type"\r\n\r\n`),
        Buffer.from(`${type}\r\n`),
        Buffer.from(`--${boundary}--\r\n`)
    ];

    // Concatenate all parts into a single buffer
    const multipartBody = Buffer.concat(body);

    const response = await request.post('/business-owner/v2/hero/poi/assignment/upload', {
        headers: {
            'Authorization': `Bearer ${loginToken}`,
            'Content-Type': `multipart/form-data; boundary=${boundary}`
        },
        data: multipartBody // Use `data` to send the buffer
    });

    return response;
};
