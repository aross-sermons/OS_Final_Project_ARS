// host/server.js

// Import required modules
const express = require('express');
const cors = require('cors');

// Initialize the Express app
const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Global variables
let sharedText = ""; // Text shared across all clients
let editingClient = null; // Tracks which client is editing

// Semaphore to control edit access
let semaphore = false;

// Endpoint to get the shared text
app.get('/text', (req, res) => {
    res.json({ text: sharedText });
});

// Endpoint to request edit access
app.post('/request-edit', (req, res) => {
    const clientId = req.body.clientId;

    if (!semaphore) {
        semaphore = true;
        editingClient = clientId;
        res.json({ success: true, message: 'Edit access granted' });
    } else if (editingClient === clientId) {
        res.json({ success: true, message: 'You already have edit access' });
    } else {
        res.json({ success: false, message: 'Another client is editing' });
    }
});

// Endpoint to release edit access
app.post('/release-edit', (req, res) => {
    const clientId = req.body.clientId;

    if (editingClient === clientId) {
        semaphore = false;
        editingClient = null;
        res.json({ success: true, message: 'Edit access released' });
    } else {
        res.json({ success: false, message: 'You do not have edit access' });
    }
});

// Endpoint to update the shared text
app.post('/text', (req, res) => {
    const { clientId, text } = req.body;

    if (editingClient === clientId) {
        sharedText = text;
        res.json({ success: true, message: 'Text updated successfully' });
    } else {
        res.json({ success: false, message: 'You do not have edit access' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

