const { fetchB3TreatedData } = require('../services/scraperB3');
const { normalizeDates, formatDateBR, formatBRDate } = require('../utils/normalizeDates');

const createB3Controller = (Model, seriesKey, app) => {
  return {
    // Scrapes B3 data for a specific date, processes it, and stores it in MongoDB.
    getData: async (req, res) => {
      try {
        const { date } = req.query;
        console.log(req.query, date);
        if (!date) {
          return res.status(400).json({ error: "Date parameter is required" });
        }
        
        const jsDate = formatBRDate(date); // Convert date from 'dd/mm/yyyy' to JavaScript Date object
        console.log("Formatted date for DB query:", jsDate);
        
        // Check if date is already in Database
        const existingRecords = await Model.find({ date: jsDate });
        console.log("Existing records in DB:", existingRecords);
        if (existingRecords.length > 0) {
          console.log(`Data for ${date} already exists in the database.`);
          return res.status(200).json({ message: `Data for ${date} already exists`, data: existingRecords });
        }

        // Retrieve holidays from app locals
        const holidays = app.locals.holidays;
        if (!holidays || !Array.isArray(holidays) || holidays.length === 0) {
          console.warn('Cached holidays array is empty or not loaded. Check app.js startup.');
          // You might decide to return an error, or proceed without holidays if your logic allows
          return res.status(500).json({ error: 'Holiday data not available on the server.' });
        }

        // Fetch data only if it does not exist in the database
        const data = await fetchB3TreatedData(date, holidays);
        console.log("Fetched B3 data:", data[0]);
        if (!data || data.length === 0) {
          return res.status(404).json({ message: "No data found for the given date" });
        }

        const formattedContracts = data.map(c => ({
          expiryDate: c[0],
          expiryCode: c[1],
          outstandingContracts: c[2],
          executedTrades: c[3],
          contractsTraded: c[4],
          volume: c[5],
          previousSettlement: c[6],
          openingPrice: c[7],
          minimumPrice: c[8],
          maximumPrice: c[9],
          averagePrice: c[10],
          lastPrice: c[11],
          settlementPrice: c[12],
          variationInPoints: c[13],
          lastBuyOrder: c[14] || null, // Optional field
          lastSellOrder: c[15] || null, // Optional field
        }));
          
        const entry = new Model({
            date: jsDate,
            contracts: formattedContracts,
        });
        console.log("Entry to save:", entry);
        await entry.save();
        console.log('Entry saved with full contracts!');
        res.status(200).json({ message: `Stored ${formattedContracts.length} new contracts of ${jsDate}`, data: entry });

      } catch (error) {
        console.error("Error fetching B3 data:", error);
        res
          .status(500)
          .json({ error: "Failed to process data", details: error.message });
      }
    },

    // Fetch most recent record date
    getMostRecentDate: async (req, res) => {
      try {
        const mostRecent = await Model.findOne().sort({ date: -1 });
        if (!mostRecent) {
          return res.json({ date: null, message: "No data available" });
        }
        res.json({
          date: mostRecent.date,
          dateBR: formatDateBR(mostRecent.date),
          contractsCount: mostRecent.contracts.length,
          contracts: mostRecent.contracts,
        });
      } catch (error) {
        res
          .status(500)
          .json({
            error: "Failed to fetch most recent date",
            details: error.message,
          });
      }
    },
  }
}

module.exports = createB3Controller;
