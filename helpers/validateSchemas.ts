import Ajv from 'ajv';
import { expect } from '@playwright/test';

export function validateResponseSchema(schema: any, response: any): boolean {
    let isValid = false;
    if (!schema || typeof schema !== 'object') {
        throw new Error("Invalid schema: schema must be an object or boolean");
    }

    const ajv = new Ajv(); // Disable strict mode
    const validate = ajv.compile(schema);
    console.log("isValid awal: ", isValid);
    isValid = validate(response);
    console.log("isValid akhir: ", isValid);

    if (!isValid && validate.errors) {
        console.log("Schema validation errors:", validate.errors);
      }
    // expect(isValid).toBe(true); // Throws an error if validation fails
    return isValid;
}
