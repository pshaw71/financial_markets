require ('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const connectDB = require('./db/connect');

const { getHolidaysFromDB } = require('./utils/workdays'); // Import the function to fetch holidays from DB

// --- Declare cachedHolidays in a scope accessible before start() ---
let cachedHolidays = []; // Declare it globally in app.js

// Initialize app.locals.holidays with the empty array
// This ensures app.locals.holidays is always an array, even before data is fetched.
app.locals.holidays = cachedHolidays; // This line is crucial for preventing 'undefined' errors on app.locals

const seriesRouter = require('./routes/series');
const bcbRouter = require('./routes/bcb');
const b3Router = require('./routes/b3');
const googleSheetsRouter = require('./routes/googleSheets');

// middleware
app.use(express.json());

// Serve static files from front-end/public
app.use(express.static(path.join(__dirname, '../front-end/public')));

// routes
app.get('/', (req, res) => {
  res.send('<h1>MARKET DATA API</h1><a href="/api/cdi">MARKET DATA API</a>');
});

// googleSheetsRouter must come before bcbRouter
app.use('/api/v1', seriesRouter);
app.use('/api/v1', googleSheetsRouter);
app.use('/api/v1', b3Router(app)); // Pass the app object to b3Router
app.use('/api/v1', bcbRouter);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URI);
    console.log('Connected to MongoDB.'); // Added for clarity

    // 2. Fetch holidays and cache them after successful DB connection
    console.log('Fetching static holiday data for caching...');
    // Assign to the already declared `cachedHolidays` variable
    const fetchedHolidays = await getHolidaysFromDB(); // Fetch
    app.locals.holidays = fetchedHolidays; // Update the reference in app.locals
    console.log(`Successfully cached ${app.locals.holidays.length} holiday dates.`);
    // console.log(app.locals.holidays);

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    // If connection or initial data fetch fails, log the error and exit
    console.error('Failed to start server or fetch initial data:', error);
    process.exit(1); // Exit the process to prevent a broken application from running
  }
}

start()