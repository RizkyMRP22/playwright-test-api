import { APIRequestContext, APIResponse } from '@playwright/test';
import { faker } from '@faker-js/faker';

let ENDPOINT_PATH = '/lead-management/lead/v1/all-source'

const fullName = faker.person.fullName()
const phoneNumber = `0812-${faker.string.numeric(4)}-${faker.string.numeric(4)}`;
const email = faker.internet.email()
const companyName = faker.company.name()
const externalId = faker.string.numeric(8)

const payload = {
    "source": "oca",
    "externalId": externalId,
    "fullName": fullName,
    "phoneNumber": phoneNumber,
    "dialCode": "+62",
    "city": "JAKARTA PUSAT",
    "refferal": {
        "referralCode": "testqa123",
        "name": "QA TEst 123",
        "occupation": "QA Platform",
        "email": "qatelkom@gmail,com",
        "phoneNumber": "08123123123"
    },
    "email": email,
    "companyName": companyName,
    "companySize": "medium_enterprise",
    "industry": "Edukasi",
    "products": [
        {
            "productId": "product-003",
            "productName": "OCA"
        },
        {
            "productId": "281f8c83-1a11-4f63-808c-3fc012eb7a67",
            "productName": "Digital Ecosystem Apps"
        }
    ],
    "discoverySource": "LinkedIn",
    "message": "i need this roduct",
    "userPseudo": {
        "clientId": externalId,
        "devicePlatform": "MacOS",
        "utmTerm": "OCA+Coba",
        "trafficSource": "google",
        "trafficMedium": "cpc",
        "campaign": "OCA_CA2024_COBA",
        "deviceCategory": "Mozilla/5.0 (Linux; Android 13; Infinix X6525 Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0.6723.107 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/484.0.0.68.109;]",
        "placement": "cekcek",
        "channel": "test"
    }
}

export const postLead = async (request: APIRequestContext): Promise<APIResponse> => {

    const response = await request.post(ENDPOINT_PATH, {
        headers: {
            'Authorization': `Basic dGVsa29tZGlnaXRhbHNvbHV0aW9uc3Q0ZzpjNTViMDNhZS0zYWUzLTQ5MDEtOWRiZC1kMjhmYmFiZGMwMTY=`
        },
        data:payload
    });
    return response;
}