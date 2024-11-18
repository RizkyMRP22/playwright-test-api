import fs from 'fs';
import path from 'path';
import { expect } from '@playwright/test';
import { ACTION_WORDING } from './constants';

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
  
  