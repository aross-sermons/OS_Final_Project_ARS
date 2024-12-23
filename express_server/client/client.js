// client/client.js

// Client-side implementation
const clientId = Math.random().toString(36).substr(2, 9); // Unique ID for the client
const apiBase = 'http://localhost:3000';

// DOM Elements
const textBox = document.getElementById('textBox');
const editButton = document.getElementById('editButton');
const saveButton = document.getElementById('saveButton');
const releaseButton = document.getElementById('releaseButton');
const statusDiv = document.getElementById('status');

// Fetch shared text from the server
async function fetchText() {
    const response = await fetch(`${apiBase}/text`);
    const data = await response.json();
    textBox.value = data.text;
    textBox.disabled = true;
}

// Request edit access
async function requestEdit() {
    const response = await fetch(`${apiBase}/request-edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
    });
    const data = await response.json();
    statusDiv.textContent = data.message;

    if (data.success) {
        textBox.disabled = false;
    }
}

// Save updated text to the server
async function saveText() {
    const text = textBox.value;

    const response = await fetch(`${apiBase}/text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, text }),
    });
    const data = await response.json();
    statusDiv.textContent = data.message;

    if (data.success) {
        textBox.disabled = true;
    }
}

// Release edit access
async function releaseEdit() {
    const response = await fetch(`${apiBase}/release-edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId }),
    });
    const data = await response.json();
    statusDiv.textContent = data.message;

    if (data.success) {
        textBox.disabled = true;
    }
}

// Event Listeners
editButton.addEventListener('click', requestEdit);
saveButton.addEventListener('click', saveText);
releaseButton.addEventListener('click', releaseEdit);

// Initialize
fetchText();

