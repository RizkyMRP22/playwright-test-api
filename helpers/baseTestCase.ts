import { expect } from '@playwright/test';
import Ajv from 'ajv';

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
      strictEqual?: boolean; // Indicates strict equality check
    }>,
    responseData: any
  ): void {
    const functionName = (new Error()).stack?.split('\n')[2]?.trim().split(' ')[1] || 'UnknownFunction';

    assertionObjects.forEach(({
      message,
      actual,
      expected,
      useSoft = false,
      contains = false,
      strictEqual = false,
    }) => {
      try {
        let assertionPassed = false;

        if (contains) {
          // Check if "actual" contains "expected"
          const match = expected instanceof Array
            ? expected.some((val) => actual.includes(val))
            : actual.includes(expected);

          assertionPassed = match;
          if (useSoft) {
            expect.soft(match, message).toBeTruthy();
          } else {
            expect(match, message).toBeTruthy();
          }
        } else if (strictEqual) {
          // Handle strict equality assertions
          assertionPassed = JSON.stringify(actual) === JSON.stringify(expected);
          if (useSoft) {
            expect.soft(actual, message).toStrictEqual(expected);
          } else {
            expect(actual, message).toStrictEqual(expected);
          }
        } else {
          // Handle regular assertions
          if (expected instanceof RegExp) {
            assertionPassed = expected.test(actual);
            if (useSoft) {
              expect.soft(actual, message).toMatch(expected);
            } else {
              expect(actual, message).toMatch(expected);
            }
          } else {
            assertionPassed = actual === expected;
            if (useSoft) {
              expect.soft(actual, message).toBe(expected);
            } else {
              expect(actual, message).toBe(expected);
            }
          }
        }

        // Log only if assertion failed
        if (!assertionPassed) {
          this.logger('error', `Assertion failed in ${functionName}: ${message}`, {
            actual,
            expected,
          });
        }

      } catch (error) {
        // Enhanced logging for exceptions
        this.logger('error', `Assertion threw an error in ${functionName}: ${message}`, {
          actual,
          expected,
          error: error.message,
        });

        // Re-throw the error to ensure test fails
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
    const functionName = (new Error()).stack?.split('\n')[2]?.trim().split(' ')[1] || 'UnknownFunction';
  
    assertionObjects.forEach(({ message, actual, useSoft = false }) => {
      try {
        if (useSoft) {
          expect.soft(actual, message).toBeDefined();
        } else {
          expect(actual, message).toBeDefined();
        }
      } catch (error) {
        // Enhanced logging for failed assertions
        this.logger('error', `Assertion failed in ${functionName}: ${message}`, {
          actual,
          responseData,
          error: error.message,
        });
  
        // Additional debugging info
        this.logger('info', `Debugging Info for ${functionName}`, {
          message,
          actual, 
          responseData
        });
  
        // Re-throw the error to ensure test fails
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
        console.info(`[INFO] ${message}`, JSON.stringify(data, null, 2) || '');
        break;
      case 'warn':
        console.warn(`[WARN] ${timestamp} \n ${message} \n`, JSON.stringify(data, null, 2) || '');
        break;
      case 'error':
        console.error(`[ERROR] ${timestamp} \n ${message} \n`, JSON.stringify(data, null, 2) || '');
        break;
      default:
        console.log(`[LOG] ${timestamp} \n ${message} \n`, JSON.stringify(data, null, 2) || '');
    }
  }

  static assertSchema(responseData: any, schema: any) {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(schema);
    const valid = validate(responseData);

    if (!valid) {
      // Process validation errors
      const errors = validate.errors?.map(error => {
        const actualValue = error.data !== undefined ? error.data : 'undefined';
        const actualType = typeof actualValue;

        // Handle missing required fields
        if (error.keyword === 'required') {
          return {
            path: error.instancePath || '(root)',
            message: `Missing required field: ${error.params.missingProperty}`,
          };
        }

        // Handle additional fields in the response that are not in the schema
        if (error.keyword === 'additionalProperties') {
          return {
            path: error.instancePath || '(root)',
            message: `Unexpected field in response: ${error.params.additionalProperty}`,
          };
        }

        // Handle type mismatches
        const expectedType = error.params.type || 'unknown';
        return {
          path: error.instancePath || '(root)',
          actualType,
          expectedType,
          message: `Please fix data type from ${actualType} to ${expectedType}`,
        };
      });

      this.logger('error', 'Validation JSON Schema errors details:', errors);
    }
    expect(valid, 'Expected Schema is valid').toBeTruthy();
  }
}

export default BaseTestCase;
