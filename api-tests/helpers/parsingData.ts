import fs from 'fs';
import path from 'path';

export const saveStorage = (fileName: string, token: string): void => {
    const FILE_PATH = path.resolve(__dirname, `../localStorage/${fileName}.localStorage.json`);
    fs.writeFileSync(FILE_PATH, JSON.stringify({ [fileName]: token }, null, 2));
}

export const getStorage = (fileName: string): string => {
    const FILE_PATH = path.resolve(__dirname, `../localStorage/${fileName}.localStorage.json`);
    const token = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    return token[fileName];
}
