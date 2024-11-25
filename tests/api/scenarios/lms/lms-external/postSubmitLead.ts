import { APIRequestContext, expect, test } from '@playwright/test';
import { getDataFaker } from '../../../../../helpers/faker';
import { callAPI } from '../../../../../helpers/callApi';
import dotenv from 'dotenv';
dotenv.config(); 

const basicToken = process.env.BASIC_AUTH_LMS || '';
const extractData = getDataFaker();

const payload = {
    source: "oca",
    externalId: extractData.externalId,
    fullName: extractData.fullName,
    phoneNumber: extractData.phoneNumber,
    dialCode: "+62",
    city: "JAKARTA PUSAT",
    refferal: {
        referralCode: "testqa123",
        name: "QA Test 123",
        occupation: "QA Platform",
        email: "qatelkom@gmail.com",
        phoneNumber: "08123123123",
    },
    email: extractData.email,
    companyName: extractData.companyName,
    companySize: "medium_enterprise",
    industry: "Edukasi",
    products: [
        {
            productId: "product-003",
            productName: "OCA",
        },
        {
            productId: "281f8c83-1a11-4f63-808c-3fc012eb7a67",
            productName: "Digital Ecosystem Apps",
        },
    ],
    discoverySource: "LinkedIn",
    message: "I need this product",
    userPseudo: {
        clientId: extractData.externalId,
        devicePlatform: "MacOS",
        utmTerm: "OCA+Coba",
        trafficSource: "google",
        trafficMedium: "cpc",
        campaign: "OCA_CA2024_COBA",
        deviceCategory:
            "Mozilla/5.0 (Linux; Android 13; Infinix X6525 Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.107 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/484.0.0.68.109;]",
        placement: "cekcek",
        channel: "test",
    },
};

interface DataAPI {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    endPoint: string;
    body?: Record<string, any>;
};

const authToken: { type: 'Basic' | 'Bearer'; token: string } = {
    type: 'Basic',
    token: basicToken
}

export async function postSubmitLead(
    request: APIRequestContext,
): Promise<any> {
    const dataAPI: DataAPI = {
        method: 'POST',
        endPoint: '/lead-management/lead/v1/all-source',
        body: payload,
    };

    try {
        const response = await callAPI(request, dataAPI, authToken);

        const responseBody = await response.json();
        expect.soft(response.ok(), 'Expected response API to be valid').toBeTruthy();

        return responseBody;
    } catch (error) {
        console.error('Failed to submit lead data:', error);
        throw error;
    }
}
