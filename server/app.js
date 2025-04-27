require ('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const connectDB = require('./db/connect');

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
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
}

start()