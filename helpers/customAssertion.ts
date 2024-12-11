import { expect } from '@playwright/test';

class CustomAssertion {
    /**
     * Perform a comparison assertion with support for both soft and hard assertions.
     */
    static expectCompare({
        message,
        actual,
        expected,
        useSoft = false,
    }: {
        message: string;
        actual: any;
        expected: any;
        useSoft?: boolean;
    }): void {
        if (useSoft) {
            if (expected instanceof RegExp) {
                expect.soft(actual, message).toMatch(expected);
            } else {
                expect.soft(actual, message).toBe(expected);
            }
        } else {
            if (expected instanceof RegExp) {
                expect(actual, message).toMatch(expected);
            } else {
                expect(actual, message).toBe(expected);
            }
        }
    }

    /**
     * Assert that a value is defined, with support for soft assertions.
     */
    static expectToBeDefined({
        message,
        actual,
        useSoft = false,
    }: {
        message: string;
        actual: any;
        useSoft?: boolean;
    }): void {
        if (useSoft) {
            expect.soft(actual, message).toBeDefined();
        } else {
            expect(actual, message).toBeDefined();
        }
    }
}

export default CustomAssertion;
