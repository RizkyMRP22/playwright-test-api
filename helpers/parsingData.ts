import fs from 'fs';
import path from 'path';
import { expect } from '@playwright/test';
import { ACTION_WORDING } from './constants';

export const saveStorageNew = (fileName: string, token: Record<string, any>): void => {
  const FILE_PATH = path.resolve(__dirname, `../assets/json/${fileName}.localStorage.json`);

  let fileData = {};
  if (fs.existsSync(FILE_PATH)) {
      // Read existing file data
      const rawData = fs.readFileSync(FILE_PATH, 'utf-8');
      try {
          fileData = JSON.parse(rawData);
      } catch (error) {
          console.error('Error parsing JSON file:', error);
      }
  }

  // Ensure the file structure has the `fileName` key as an object
  fileData[fileName] = fileData[fileName] || {};

  // Merge the new token into the existing object
  fileData[fileName] = {
      ...fileData[fileName],
      ...token
  };

  // Write updated data back to the file
  fs.writeFileSync(FILE_PATH, JSON.stringify(fileData, null, 2));
};

export const saveStorage = (fileName: string, token: any): void => {
    const FILE_PATH = path.resolve(__dirname, `../assets/json/${fileName}.localStorage.json`);
    fs.writeFileSync(FILE_PATH, JSON.stringify({ [fileName]: token }, null, 2));
}

export const getStorage = (fileName: any): any => {
    const FILE_PATH = path.resolve(__dirname, `../assets/json/${fileName}.localStorage.json`);
    const token = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
    return token[fileName];
}

export const getFileUpload = (fileName: string, type: string): Buffer | null => {
    try {
        const filePath = path.join(__dirname, `../assets/${type}/${fileName}`);
        
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

/**
 * Validates action information based on the given action type.
 * @param actionType - The action type to validate.
 * @param actionInfo - The action information from the response data.
 */
export const validateActionInfo = (actionType: string, actionInfo: any) => {
  const actionConfig = ACTION_WORDING[actionType];
  if (!actionConfig) {
    throw new Error(`Action type "${actionType}" is not defined in ACTION_WORDING`);
  }

  expect.soft(actionInfo.title, `Expected title for action type ${actionType}`).toBe(actionConfig.title);
  expect.soft(actionInfo.subtitle, `Expected subtitle for action type ${actionType}`).toBe(actionConfig.subtTitle);

  if (actionConfig.button) {
    expect.soft(actionInfo.button, 'Expected button to be an array').toBeInstanceOf(Array);
    expect.soft(actionInfo.button, `Expected buttons to match for action type ${actionType}`).toEqual(
      expect.arrayContaining(actionConfig.button)
    );
  } else {
    expect.soft(actionInfo.button, 'No buttons expected').toBeUndefined();
  }
};

/**
 * Tests and validates actionInfo from the response data.
 * @param actionInfo - The action information from the response data.
 */
export const testActionInfo = (actionInfo: any) => {
    if (!actionInfo) {
      // Handle missing actionInfo gracefully
      console.log('actionInfo is not defined in the response. Skipping validation for this entry.');
      return;
    }
  
    if (actionInfo.action === '') {
      // Handle empty action
      console.log('Action is empty. Skipping validation as this is valid for the current context.');
      return;
    }
  
    if (actionInfo.action) {
      switch (actionInfo.action) {
        // Assignment Actions
        case 'self-assign':
        case 'assign':
        case 'reassign':
        case 'validation-self-assign':
        // Approval Actions
        case 'approval-new-poi':
        case 'approval-bundling':
        case 'approval-found':
        case 'approval-not-found':
        case 'waiting-approval':
        // Negative Cases
        case 'unauthorized':
        case 'unable-approve':
        // Validation Action
        case 'validation-action-info':
          validateActionInfo(actionInfo.action, actionInfo);
          break;
  
        default:
          throw new Error(`Unknown action type: ${actionInfo.action}`);
      }
    } else {
      throw new Error('action is undefined or null in actionInfo');
    }
  };


export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  
/**
 * Search for an object by its ID in the list of data.
 * @param dataList - The array of data objects.
 * @param id - The ID to search for.
 * @returns The object with the matching ID or null if not found.
 */
export function searchById(dataList: any[], id: any): any | null {
  return dataList.find((item) => Number(item.id) === id) || null;
}

export async function compareMenuFields(responseMenuUser: any, responseMenuBO: any) {
  const userMenuData = responseMenuUser.data;
  const boMenuData = responseMenuBO.data;

  const mismatchedEntries: any[] = [];
  
  // Compare each menu item from User Management with BO menu
  userMenuData.forEach((userMenuItem: any) => {
      const matchedBOItem = boMenuData.find((boMenuItem: any) => boMenuItem.key === userMenuItem.key);

      if (!matchedBOItem) {
          mismatchedEntries.push({
              key: userMenuItem.key,
              status: 'Missing in BO Menu',
              userMenuItem,
          });
          return;
      }

      // Compare specific fields
      const fields = ['group', 'label', 'target'];
      const fieldMismatches = fields.filter((field) => userMenuItem[field] !== matchedBOItem[field]);

      if (fieldMismatches.length > 0) {
          mismatchedEntries.push({
              key: userMenuItem.key,
              status: 'Field Mismatch',
              mismatchedFields: fieldMismatches.reduce((acc, field) => {
                  acc[field] = {
                      valueInUserMgt: userMenuItem[field],
                      valueInBO: matchedBOItem[field],
                  };
                  return acc;
              }, {}),
          });
      }
  });

  // Check for items in BO Menu that are missing from User Management Menu
  boMenuData.forEach((boMenuItem: any) => {
      const matchedUserItem = userMenuData.find((userMenuItem: any) => userMenuItem.key === boMenuItem.key);
      if (!matchedUserItem) {
          mismatchedEntries.push({
              key: boMenuItem.key,
              status: 'Missing in User Management Menu',
              boMenuItem,
          });
      }
  });

  if (mismatchedEntries.length === 0) {
      console.log('All menu items match perfectly!');
  } else {
      console.log('Mismatched Menu Items:', JSON.stringify(mismatchedEntries, null, 2));
  }

  return mismatchedEntries;
}