import fs from 'fs';
import path from 'path';

export const saveStorage = (fileName: string, token: string): void => {
    const TOKEN_PATH = path.resolve(__dirname, `../localStorage/${fileName}.localStorage.json`);
    fs.writeFileSync(TOKEN_PATH, JSON.stringify({ [fileName] : token }));
}

export const getStorage = (fileName: string): string => {
    const TOKEN_PATH = path.resolve(__dirname, `../localStorage/${fileName}.localStorage.json`);
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
    return token[fileName];
}
