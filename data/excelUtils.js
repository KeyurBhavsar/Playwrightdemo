// ===================================================================
// JAVASCRIPT VERSION - Excel Utils
// ===================================================================
// CONVERSION NOTES:
// TypeScript: import * as XLSX from 'xlsx';
// JavaScript: const XLSX = require('xlsx');
//
// TypeScript: export function readUsersFromExcel(filePath: string, sheetName: string = 'Sheet1'): any[]
// JavaScript: function readUsersFromExcel(filePath, sheetName = 'Sheet1')
//
// TypeScript: catch (error: any)
// JavaScript: catch (error)
// ===================================================================

const XLSX = require('xlsx');

/**
 * Reads user data from an Excel file and returns it as an array of objects.
 * Assumes the first row contains headers (e.g., Username, Password).
 * @param {string} filePath - The path to the Excel file (e.g., './data/testlogin.xlsx').
 * @param {string} sheetName - The name of the sheet to read (defaults to 'Sheet1').
 * @returns {Array} An array of objects where keys are column headers.
 */
function readUsersFromExcel(filePath, sheetName = 'Sheet1') {
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
        // JavaScript: No type annotation needed
        // TypeScript had: const data: any[] = XLSX.utils.sheet_to_json(worksheet);
        const data = XLSX.utils.sheet_to_json(worksheet); 

        console.log(`Successfully loaded ${data.length} user records from Excel.`);
        return data;
        
    } catch (error) {
        // JavaScript: catch (error)
        // TypeScript had: catch (error: any)
        console.error(`Error reading Excel file at ${filePath}. Make sure the file exists and is not open:`, error.message);
        return [];
    }
}

// JavaScript: Export using module.exports
// TypeScript: export function readUsersFromExcel(...)
module.exports = { readUsersFromExcel };

