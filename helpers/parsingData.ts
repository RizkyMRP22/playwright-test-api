import fs from 'fs';
import path from 'path';

export const saveStorage = (fileName: string, token: string): void => {
    const FILE_PATH = path.resolve(__dirname, `../assets/json/${fileName}.localStorage.json`);
    fs.writeFileSync(FILE_PATH, JSON.stringify({ [fileName]: token }, null, 2));
}

export const getStorage = (fileName: string): string => {
    const FILE_PATH = path.resolve(__dirname, `../assets/json/${fileName}.localStorage.json`);
    const token = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    return token[fileName];
}

export const getFileUpload = (fileName: string, type: string): Buffer | null => {
    try {
        const filePath = path.join(__dirname, `../assets/${type}/${fileName}`);
        console.log('Resolved file path:', filePath);
        
        if (fs.existsSync(filePath)) {
            const fileBuffer = fs.readFileSync(filePath);
            return fileBuffer;
        } else {
            console.error(`File not found: ${filePath}`);
            return null;
        }
    } catch (error) {
        console.error(`Error reading file: ${error}`);
        return null;
    }
};