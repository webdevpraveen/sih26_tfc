/**
 * Google Sheets Service
 * 
 * Instructions:
 * 1. Deploy your Google Apps Script as a Web App.
 * 2. Copy the Web App URL and paste it below.
 */

// TODO: Replace this URL with your actual Google Apps Script Web App URL
export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyEP83k6rXxnMMZKPhLK-umoWMIVvP7l0f4TiVj6ElZpN5Huh6BfnuabABQSPIXfbFowA/exec';

export const fetchTeamsFromSheet = async () => {
  try {
    if (SCRIPT_URL.includes('MOCK_URL_CHANGE_ME')) {
      console.warn("Please update the SCRIPT_URL in sheetService.js with your deployed Google Apps Script URL.");
      return [];
    }

    const response = await fetch(SCRIPT_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch sheet data');
    }
    
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching teams from sheet:", error);
    return [];
  }
};
