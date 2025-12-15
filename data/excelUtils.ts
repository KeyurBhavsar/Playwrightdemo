// data/excelUtils.ts

import * as XLSX from 'xlsx';

/**
 * Reads user data from an Excel file and returns it as an array of objects.
 * Assumes the first row contains headers (e.g., Username, Password).
 * @param filePath - The path to the Excel file (e.g., './data/testlogin.xlsx').
 * @param sheetName - The name of the sheet to read (defaults to 'Sheet1').
 * @returns An array of objects where keys are column headers.
 */
export function readUsersFromExcel(filePath: string, sheetName: string = 'Sheet1'): any[] {
    try {
        // Read the workbook from the file path
        const workbook = XLSX.readFile(filePath);  //D:\Playwright_training\Data\testlogin.xlsx
        
        // Check if the specified sheet exists
        if (!workbook.Sheets[sheetName]) {
            console.error(`Error: Sheet '${sheetName}' not found in the workbook.`);
            return [];
        }

        // Get the worksheet
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert the worksheet data to a JSON array.
        // The 'any[]' return type is used here because the object keys are dynamic (from Excel headers).
        const data: any[] = XLSX.utils.sheet_to_json(worksheet); 

        console.log(`Successfully loaded ${data.length} user records from Excel.`);
        return data;
        
    } catch (error: any) {
        console.error(`Error reading Excel file at ${filePath}. Make sure the file exists and is not open:`, error.message);
        return [];
    }
}