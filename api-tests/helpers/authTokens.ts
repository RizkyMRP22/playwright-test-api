// authTokens.ts
let tokenGenerate: string = '';
let loginToken: string = '';

// Functions to get tokens
export const getTokenGenerate = (): string => tokenGenerate;
export const getLoginToken = (): string => loginToken;

// Functions to set tokens
export const setTokenGenerate = (token: string): void => {
    tokenGenerate = token;
};

export const setLoginToken = (token: string): void => {
    loginToken = token;
};
