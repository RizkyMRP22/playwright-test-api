import { APIRequestContext, APIResponse } from '@playwright/test';

/**
 * Interface for API request details.
 */
export interface DataAPI {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endPoint: string;
  body?: Record<string, any>;
}

/**
 * Interface for authorization details.
 */
export interface Auth {
  type: 'Bearer' | 'Basic';
  token?: string;
}

/**
 * BaseAPI class to standardize API requests.
 */
export class BaseAPI {
  /**
   * A static method to make API calls.
   * @param request - Playwright's APIRequestContext
   * @param dataAPI - The API details such as method, endpoint, and body
   * @param auth - Optional authorization details
   * @returns The API response as a Promise
   */
  static async callAPI(
    request: APIRequestContext,
    dataAPI: DataAPI,
    auth?: Auth,
  ): Promise<APIResponse> {
    const { method, endPoint, body } = dataAPI;

    // Construct headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(auth?.type && auth?.token ? { Authorization: `${auth.type} ${auth.token}` } : {}),
    };

    // Perform the API request based on the HTTP method
    try {
      const options = { headers, ...(body && { data: body }) };

      switch (method) {
        case 'POST':
        case 'PUT':
        case 'PATCH':
        case 'DELETE':
          return await request[method.toLowerCase() as 'post' | 'put' | 'patch' | 'delete'](endPoint, options);

        case 'GET':
          return await request.get(endPoint, {
            headers,
            params: body,
          });

        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }

    } catch (error) {
      console.error(`Error during API call: ${method} ${endPoint}`, error);
      throw error;
    }
  }
}
