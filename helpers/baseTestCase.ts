import { expect } from '@playwright/test';

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
      contains?: boolean; // Indicates "contains" check
      strictEqual?: boolean; // New property for strict equality check
    }>,
    responseData: any
  ): void {
    assertionObjects.forEach(({ message, actual, expected, useSoft = false, contains = false, strictEqual = false }) => {
      try {
        if (contains) {
          // Check if "actual" contains "expected"
          const match = expected instanceof Array
            ? expected.some((val) => actual.includes(val))
            : actual.includes(expected);
  
          if (useSoft) {
            expect.soft(match, message).toBeTruthy();
          } else {
            expect(match, message).toBeTruthy();
          }
        } else if (strictEqual) {
          // Handle strict equality assertions
          if (useSoft) {
            expect.soft(actual, message).toStrictEqual(expected);
          } else {
            expect(actual, message).toStrictEqual(expected);
          }
        } else if (useSoft) {
          // Handle regular assertions
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
      } catch (error) {
        console.error(`Assertion failed: ${message}`);
        console.info('Debugging Info:');
        console.info(`- Expected: ${JSON.stringify(expected, null, 2)}`);
        console.info(`- Actual: ${JSON.stringify(actual, null, 2)}`);
        console.info('- Response Data:', JSON.stringify(responseData, null, 2));
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
    assertionObjects.forEach(({ message, actual, useSoft = false }) => {
      try {
        if (useSoft) {
          expect.soft(actual, message).toBeDefined();
        } else {
          expect(actual, message).toBeDefined();
        }
      } catch (error) {
        console.error(`Assertion failed: ${message}`);
        console.info('Debugging Info:');
        console.info(`- Actual: ${JSON.stringify(actual, null, 2)}`);
        console.info('- Response Data:', JSON.stringify(responseData, null, 2));
        throw error;
      }
    });
  }

    /**
   * Logger function to standardize log output.
   * @param type - The type of log (info, warn, error).
   * @param message - The message to log.
   * @param data - Optional additional data to include in the log.
   */
    static logger(type: 'info' | 'warn' | 'error', message: string, data?: any): void {
      const timestamp = new Date().toISOString();
      switch (type) {
        case 'info':
          console.info(`[INFO] ${message}`, JSON.stringify(data,null,2) || '');
          break;
        case 'warn':
          console.warn(`[WARN] ${timestamp} - ${message} \n`, JSON.stringify(data,null,2) || '');
          break;
        case 'error':
          console.error(`[ERROR] ${timestamp} - ${message} \n`, JSON.stringify(data,null,2) || '');
          break;
        default:
          console.log(`[LOG] ${timestamp} - ${message} \n`, JSON.stringify(data,null,2) || '');
      }
    }
}

export default BaseTestCase;
