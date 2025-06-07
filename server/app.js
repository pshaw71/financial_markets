require ('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const connectDB = require('./db/connect');
const { getHolidaysFromDB } = require('./utils/workdays'); // Import the function to fetch holidays from DB

const seriesRouter = require('./routes/series');
const bcbRouter = require('./routes/bcb');
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
app.use('/api/v1', bcbRouter);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGO_URI);

    // 2. Fetch holidays and cache them after successful DB connection
    console.log('Fetching static holiday data for caching...');
    cachedHolidays = await getHolidaysFromDB(); // Populate the array
    app.locals.holidays = cachedHolidays; // Update app.locals with the fetched data
    console.log(`Successfully cached ${cachedHolidays.length} holiday dates.`);
    // console.log(cachedHolidays);

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