import { APIRequestContext } from '@playwright/test';
import { AuthEndpoints } from '../../endpoints/auth.api';
import { getDataFaker } from '../../../../helpers/faker';
import BaseTestCase from '../../../../helpers/baseTestCase';

class ProfileCases extends BaseTestCase {

    static async getProfile(request: APIRequestContext, loginToken: string): Promise<void> {
        const response = await AuthEndpoints.getProfile(request, loginToken);
        const responseData = await response.json();

        this.assertCompare([
            {
                message: 'Expected response code is 200',
                actual: responseData.code,
                expected: 200,
            },
            {
                message: 'Expected message is "User ditemukan"',
                actual: responseData.message,
                expected: 'User ditemukan',
            }], responseData
        );

        return responseData;
    }

    static async getProfileWithInvalidToken(request: APIRequestContext): Promise<void> {
        const invalidToken = getDataFaker().invalidToken;
        const response = await AuthEndpoints.getProfile(request, invalidToken);
        const responseData = await response.json();

        this.assertCompare([
            {
                message: 'Expected response code is 401',
                actual: responseData.code,
                expected: 401,
            },
            {
                message: 'Expected message is "Invalid token format"',
                actual: responseData.message,
                expected: 'Invalid token format',
            }], responseData
        );
        return responseData;
    }
}

export default ProfileCases;
