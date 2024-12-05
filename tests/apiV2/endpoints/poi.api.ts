import { APIRequestContext, APIResponse } from '@playwright/test';
import { BaseAPI } from '../../../helpers/baseApi';
import dotenv from 'dotenv';
import { getFileUpload } from '../../../helpers/parsingData';
dotenv.config();

/**
 * PoiEndpoints class to manage POI (Point of Interest) related APIs.
 */
export class PoiEndpoints extends BaseAPI {
    /**
     * Fetches the summary of POI.
     * @param request - Playwright's APIRequestContext
     * @param loginToken - Bearer token for authentication
     * @returns APIResponse with the summary data
     */
    static async getSummaryPoi(
        request: APIRequestContext,
        loginToken: string
    ): Promise<APIResponse> {
        return this.callAPI(
            request,
            {
                method: 'GET',
                endPoint: '/business-owner/v2/hero/poi/summary-poi',
            },
            {
                type: 'Bearer',
                token: loginToken,
            }
        );
    }

    /**
     * Uploads an image file.
     * @param request - Playwright's APIRequestContext
     * @param loginToken - Bearer token for authentication
     * @param filename - The name of the file to upload
     * @returns APIResponse with the upload status
     */
    static async postUploadImages(
        request: APIRequestContext,
        loginToken: string,
        filename: string
    ): Promise<APIResponse> {
        const fileBuffer = getFileUpload(filename, 'images');

        if (!fileBuffer) {
            throw new Error(`File "${filename}" could not be found or read.`);
        }

        const formData = {
            file: {
                name: filename,
                mimeType: 'image/jpeg',
                buffer: fileBuffer,
            },
            path: 'image',
        };

        try {
            return await request.post('/business-owner/v1/general/upload', {
                headers: {
                    Authorization: `Bearer ${loginToken}`,
                },
                multipart: formData,
            });
        } catch (error) {
            console.error('Error during file upload:', error);
            throw error;
        }
    }

    /**
     * Adds a new POI.
     * @param request - Playwright's APIRequestContext
     * @param loginToken - Bearer token for authentication
     * @param payload - The data to add the new POI
     * @returns APIResponse with the add status
     */
    static async postAddNewPOI(
        request: APIRequestContext,
        loginToken: string,
        payload: Record<string, any>
    ): Promise<APIResponse> {
        return this.callAPI(
            request,
            {
                method: 'POST',
                endPoint: '/business-owner/v1/hero/poi/add',
                body: payload,
            },
            {
                type: 'Bearer',
                token: loginToken,
            }
        );
    }

    /**
     * Fetches the details of a specific POI.
     * @param request - Playwright's APIRequestContext
     * @param loginToken - Bearer token for authentication
     * @param idPoi - The ID of the POI
     * @returns APIResponse with the POI details
     */
    static async getPoiDetail(
        request: APIRequestContext,
        loginToken: string,
        idPoi: string
    ): Promise<APIResponse> {
        return this.callAPI(
            request,
            {
                method: 'GET',
                endPoint: `/business-owner/v1/hero/poi/detail-poi/${idPoi}`,
            },
            {
                type: 'Bearer',
                token: loginToken,
            }
        );
    }

    /**
     * Fetches assignment details of a specific POI.
     * @param request - Playwright's APIRequestContext
     * @param loginToken - Bearer token for authentication
     * @param idPoi - The ID of the POI
     * @returns APIResponse with the assignment details
     */
    static async getAssignmentPoiDetail(
        request: APIRequestContext,
        loginToken: string,
        idPoi: string
    ): Promise<APIResponse> {
        return this.callAPI(
            request,
            {
                method: 'GET',
                endPoint: `/business-owner/v2/hero/poi/assignment/detail/${idPoi}`,
            },
            {
                type: 'Bearer',
                token: loginToken,
            }
        );
    }
};