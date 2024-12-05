import { APIRequestContext } from '@playwright/test';
import { AuthEndpoints } from '../../endpoints/auth.api';
import BaseTestCase from '../../../../helpers/baseTestCase';

class LoginCases extends BaseTestCase {
    /**
     * Valid login scenario.
     * Verifies response code and message for successful login.
     */
    static async validLogin(request: APIRequestContext): Promise<any> {
        const response = await AuthEndpoints.postLogin(request);
        const responseData = await response.json();

        this.assertCompare(
            [
                {
                    message: 'Expected response code is 200',
                    actual: responseData.code,
                    expected: 200,
                    useSoft: true,
                },
                {
                    message: 'Expected message is "Your Request Has Been Processed"',
                    actual: responseData.message,
                    expected: 'Your Request Has Been Processed',
                    useSoft: true,
                },
            ],
            responseData
        );

        return responseData;
    }

    /**
     * Invalid login scenario with incorrect credentials.
     */
    static async invalidLogin(request: APIRequestContext): Promise<any> {
        const payload = { password: 'invalidpassword' };
        const response = await AuthEndpoints.postLogin(request, payload);
        const responseData = await response.json();

        this.assertCompare(
            [
                {
                    message: 'Expected response code is 400',
                    actual: responseData.code,
                    expected: 400,
                    useSoft: true,
                },
                {
                    message: 'Expected message is "NIK / Email / Password Salah"',
                    actual: responseData.message,
                    expected: 'NIK / Email / Password Salah',
                    useSoft: true,
                },
            ],
            responseData
        );

        return responseData;
    }

    /**
     * Invalid login scenario repeated 5 times to trigger lockout.
     */
    static async invalidLogin5Times(request: APIRequestContext): Promise<any> {
        const payload = { username: process.env.NIK_OTHERS };

        for (let attempt = 1; attempt <= 3; attempt++) {
            const response = await AuthEndpoints.postLogin(request, payload);
            const responseData = await response.json();

            this.assertCompare(
                [
                    {
                        message: 'Expected response code is 400',
                        actual: responseData.code,
                        expected: 400,
                        useSoft: true,
                    },
                    {
                        message: 'Expected message is "NIK / Email / Password Salah"',
                        actual: responseData.message,
                        expected: 'NIK / Email / Password Salah',
                        useSoft: true,
                    },
                ],
                responseData
            );
        }

        const finalResponse = await AuthEndpoints.postLogin(request, payload);
        const responseData = await finalResponse.json();

        const lockoutMessagePattern =
            /^Kamu sudah 3 kali salah memasukkan NIK\/email\/password\. Silakan coba lagi setelah \d+ detik\.$/;

        this.assertCompare(
            [
                {
                    message: 'Expected response code is 400',
                    actual: responseData.code,
                    expected: 400,
                    useSoft: true,
                },
                {
                    message: 'Expected message matches the lockout message pattern',
                    actual: responseData.message,
                    expected: 'Akun Terkunci Sementara',
                    useSoft: true,
                },
                {
                    message: 'Expected details.eventCode is 5',
                    actual: responseData.details.eventCode,
                    expected: 5,
                    useSoft: true,
                },
                {
                    message: 'Expected details.message matches lockout pattern',
                    actual: responseData.details.message,
                    expected: lockoutMessagePattern,
                    useSoft: true,
                },
            ],
            responseData
        );

        this.assertDefined(
            [
                {
                    message: 'Expected counter to be defined',
                    actual: responseData.details.counter,
                    useSoft: true,
                },
            ],
            responseData
        );

        return responseData;
    }
}

export default LoginCases;
