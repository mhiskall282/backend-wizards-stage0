require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const {AbortController} = require('abort-controller');

const app = express();
const PORT = process.env.PORT || 3000;
const CATFACT_URL = process.env.CATFACT_URL || 'https://catfact.ninja/fact';
const CATFACT_TIMEOUT_MS = parseInt(process.env.CATFACT_TIMEOUT_MS || '2500', 10);
// Config from env
const USER_EMAIL = process.env.USER_EMAIL || 'johnokyere282@icloud.com';
const USER_NAME = process.env.USER_NAME || 'John Okyere';
const USER_STACK = process.env.USER_STACK || 'Node.js/Express';

// Basic logging middleware
app.use((req, res, next) => {
console.log(new Date().toISOString(), req.method, req.url);
next();
});


// CORS headers (simple permissive setup; tune for production)
app.use((req, res, next) => {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
next();
});

// GET /me
app.get('/me', async (req, res) => {
res.setHeader('Content-Type', 'application/json');
// Prevent caching (ensures fresh fact per request)
res.setHeader('Cache-Control', 'no-store');


const timestamp = new Date().toISOString();


// Fetch cat fact with timeout
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), CATFACT_TIMEOUT_MS);


let fact = null;
try {
const response = await fetch(CATFACT_URL, { signal: controller.signal, timeout: CATFACT_TIMEOUT_MS });
clearTimeout(timeout);
if (!response.ok) throw new Error(`Cat API returned ${response.status}`);
const data = await response.json();
if (data && data.fact && typeof data.fact === 'string') {
fact = data.fact;
} else {
throw new Error('Cat API malformed response');
}
} catch (err) {
 // Log error and provide graceful fallback
 console.error('Failed to fetch cat fact:', err.message || err);
 fact = 'Could not fetch a cat fact right now — try again soon.';
}

// Respond with user info and the fetched (or fallback) cat fact
// res.status(200).json({
//   name: USER_NAME,
//   email: USER_EMAIL,
//   stack: USER_STACK,
//   timestamp,
//   fact
// });
// });

const payload = {
  status: "success",
  user: {
    email: USER_EMAIL,
    name: USER_NAME,
    stack: USER_STACK,
  },
  timestamp,
  fact,
};

res.status(200).json(payload);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




// Basic healthcheck
app.get('/', (req, res) => res.send('OK'));


if (require.main === module) {
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}


module.exports = app;