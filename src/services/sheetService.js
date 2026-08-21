/**
 * Google Sheets Service
 * 
 * Instructions:
 * 1. Deploy your Google Apps Script as a Web App.
 * 2. Copy the Web App URL and paste it below.
 */

// TODO: Replace this URL with your actual Google Apps Script Web App URL
export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz_MOCK_URL_CHANGE_ME/exec';

export const fetchTeamsFromSheet = async () => {
  try {
    // During development, if SCRIPT_URL is empty or mock, we can return dummy data
    if (SCRIPT_URL.includes('MOCK_URL_CHANGE_ME')) {
      return getMockTeams();
    }

    const response = await fetch(SCRIPT_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch sheet data');
    }
    
    // The Apps script should return JSON in this format:
    // { data: [ { "Team Name": "...", "Member 1": "...", ... } ] }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching teams from sheet:", error);
    return getMockTeams(); // Fallback to mock on error during dev
  }
};

const getMockTeams = () => [
  {
    "Team Name": "CodeX Innovators",
    "Member 1 (Leader)": "Praveen Singh",
    "Member 2": "Amit Kumar",
    "Member 3": "Neha Sharma",
    "Member 4": "Rohan Gupta",
    "Member 5": "Priya Verma",
    "Member 6": "Rahul Jain",
    "Verified": true
  },
  {
    "Team Name": "Syntax Errors",
    "Member 1 (Leader)": "Sanya Kapoor",
    "Member 2": "Vikas Singh",
    "Member 3": "Anjali Das",
    "Member 4": "Manish Tiwari",
    "Member 5": "Kritika Mehta",
    "Member 6": "Arjun Patel",
    "Verified": false
  },
  {
    "Team Name": "AI Pioneers",
    "Member 1 (Leader)": "Deepak Yadav",
    "Member 2": "Simran Kaur",
    "Member 3": "Kunal Sen",
    "Member 4": "Aditi Rao",
    "Member 5": "Pratham Sharma",
    "Member 6": "Nisha Verma",
    "Verified": true
  },
  {
    "Team Name": "Byte Me",
    "Member 1 (Leader)": "Shubham Gupta",
    "Member 2": "Aakash Singh",
    "Member 3": "Riya Chaturvedi",
    "Member 4": "Karan Malhotra",
    "Member 5": "Pooja Yadav",
    "Member 6": "Tarun Sharma",
    "Verified": false
  }
];
