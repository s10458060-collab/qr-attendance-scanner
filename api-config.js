const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw8j39VBNRe3BdFbykiZBDzqtHxJN6TMqVdgFTX1p3nR_-XJAba-NUpj6uWFHQCVixS/exec";
const API_KEY = "SUPER_SECRET_API_KEY_12345"; // Must match Code.gs API_KEY

// Replace this with your active Google Apps Script Web App URL ending in /exec
const API_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
const API_KEY = "SUPER_SECRET_API_KEY_12345";

async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sendSecureRequest(action, payload) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Crucial: text/plain avoids CORS preflight blocks in Apps Script
      body: JSON.stringify({ apiKey: API_KEY, action: action, payload: payload })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Network connection error:", error);
    return { success: false, message: "Network connection error. Check your API_URL or Apps Script deployment." };
  }
}

async function loginApi(username, password) {
  const pHash = await hashPassword(password);
  return sendSecureRequest('login', { username: username, passwordHash: pHash });
}

async function registerStudentApi(studentData) {
  return sendSecureRequest('registerStudent', studentData);
}

async function getValidClassesApi() {
  return sendSecureRequest('getClasses', {});
}

async function searchStudentsApi(query) {
  return sendSecureRequest('searchStudents', { query: query });
}

async function recordAttendanceApi(studentId) {
  return sendSecureRequest('recordAttendance', { studentId: studentId });
}
