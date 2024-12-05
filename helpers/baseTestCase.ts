import CustomAssertion from '../helpers/customAssertion';

class BaseTestCase {
    /**
     * Perform multiple comparison assertions.
     * Logs errors and response data on failure.
     */
    static assertCompare(
        assertionObjects: Array<{
            message: string;
            actual: any;
            expected: any;
            useSoft?: boolean;
        }>,
        responseData: any
    ): void {
        assertionObjects.forEach((assertionObject) => {
            try {
                CustomAssertion.expectCompare(assertionObject);
            } catch (error) {
                console.error(`Assertion failed: ${assertionObject.message}`);
                console.info('Response Data:', responseData);
                throw error;
            }
        });
    }

    /**
     * Perform multiple "defined" assertions.
     * Logs errors and response data on failure.
     */
    static assertDefined(
        assertionObjects: Array<{
            message: string;
            actual: any;
            useSoft?: boolean;
        }>,
        responseData: any
    ): void {
        assertionObjects.forEach((assertionObject) => {
            try {
                CustomAssertion.expectToBeDefined(assertionObject);
            } catch (error) {
                console.error(`Defined Assertion failed: ${assertionObject.message}`);
                console.info('Response Data:', responseData);
                throw error;
            }
        });
    }
}

export default BaseTestCase;
