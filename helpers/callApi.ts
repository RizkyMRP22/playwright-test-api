import { APIRequestContext, APIResponse } from '@playwright/test';

interface DataAPI {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endPoint: string;
  body?: Record<string, any>;
}

interface Auth {
    type: 'Bearer' | 'Basic';
    token:string
}

export async function callAPI(
  request: APIRequestContext,
  dataAPI: DataAPI,
  auth?: Auth
): Promise<APIResponse> {
  const { method, endPoint, body } = dataAPI;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(auth?.type && auth?.token && { Authorization: `${auth.type} ${auth.token}` }),
  };

  let response: APIResponse;

  if (['POST', 'PUT', 'PATCH'].includes(method)) {
    response = await request[method.toLowerCase() as 'post' | 'put' | 'patch'](endPoint, {
      headers,
      data: body,
    });
  } else if (method === 'GET') {
    response = await request.get(endPoint, {
      headers,
      params: body,
    });
  } else if (method === 'DELETE') {
    response = await request.delete(endPoint, {
      headers,
      data: body,
    });
  } else {
    throw new Error(`Unsupported method: ${method}`);
  }

  if (!response.ok()) {
    throw new Error(`API call failed: ${response.status()} - ${await response.text()}`);
  }

  return response;
}
