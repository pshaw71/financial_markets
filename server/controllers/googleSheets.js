const { google } = require("googleapis");
const {
  normalizeDates,
  formatDateBR,
  formatBRDate,
} = require("../utils/normalizeDates");
// const HolidaysBR = require('../models/holidaysBR');

const auth = new google.auth.GoogleAuth({
  keyFile: "./googleDB.json", // Path to your service account JSON
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const SPREADSHEET_ID = "1S8Z1MQ6-svxTsUZEzJs8J6vye-yGuXL2pjZLGPAmMRY";
const sheets = google.sheets({ version: "v4", auth });

const createGoogleSheetsController = (Model, seriesKey) => {
  console.log("createGoogleSheetsController:", Model, seriesKey);
  const range = {
    holidaysbr_dates: "Feriados!A2:A752",
    copom: "Cal!E2:E1000",
    ipca_dates: "Cal!A2:A1000",
  }[seriesKey];

  if (!range) {
    throw new Error(`Invalid series key: ${seriesKey}`);
  }
  return {
    // Fetch and store dates from Google Sheets
    getRecordsFromSheets: async (req, res) => {
      try {
        const spreadsheetId = SPREADSHEET_ID;
        console.log("range: ", range);
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range,
        });
        console.log(
          "Response from Google Sheets:",
          response.data.values.length
        );
        const rows = response.data.values || [];
        const records = rows
          .flat() // Flatten array of arrays
          .filter((date) => date) // Remove empty cells
          .map((date) => {
            const [day, month, year] = date.split("/");
            const formattedDate = new Date(`${year}-${month}-${day}`);
            return { date: new Date(formattedDate.setUTCHours(0, 0, 0, 0)) };
          });
        console.log("Dates fetched from Google Sheets:", records.length);
        if (records.length === 0) {
          return res
            .status(200)
            .json({ message: "No dates found in Google Sheets", data: [] });
        }

        // Check for existing dates in MongoDB
        const datesToInsert = records.map((item) => item.date);
        const existingRecords = await Model.find({
          date: { $in: datesToInsert },
        });
        const existingDates = new Set(
          existingRecords.map((r) => r.date.toISOString())
        );
        const newRecords = records.filter(
          (item) => !existingDates.has(item.date.toISOString())
        );

        if (newRecords.length === 0) {
          return res
            .status(200)
            .json({ message: "No new dates to store", data: [] });
        }

        await Model.insertMany(newRecords, { ordered: false });
        res
          .status(200)
          .json({
            message: `Stored ${newRecords.length} new ${seriesKey}`,
            data: newRecords,
          });
      } catch (error) {
        console.error(`Error fetching ${seriesKey} from Google Sheets:`, error);
        res
          .status(500)
          .json({
            error: `Failed to process ${seriesKey}`,
            details: error.message,
          });
      }
    },

    // Fetch all dates from MongoDB
    getAllRecords: async (req, res) => {
      try {
        const { startDate, endDate } = req.query;
        // console.log('getAllRecords:', req.query)
        let query = {};
        if (startDate || endDate) {
          query.date = {};
          if (startDate) query.date.$gte = new Date(startDate);
          if (endDate) query.date.$lte = new Date(endDate);
        }
        const records = await Model.find(query).sort({ date: -1 });
        // console.log('getAllRecords:', records);
        res.json(records);
      } catch (error) {
        console.error(`Error fetching ${seriesKey} records:`, error);
        res
          .status(500)
          .json({
            error: `Failed to fetch ${seriesKey} records`,
            details: error.message,
          });
      }
    },

    // Get the last date available in the database
    getMostRecentRecord: async (req, res) => {
      try {
        console.log("getMostRecentRecord:", seriesKey);
        const mostRecent = await Model.findOne().sort({ date: -1 });
        if (!mostRecent) {
          return res.json({
            date: null,
            message: `No ${seriesKey} data available`,
          });
        }
        res.json({
          date: mostRecent.date,
          dateBR: formatDateBR(mostRecent.date),
        });
      } catch (error) {
        console.error(`Error fetching most recent ${seriesKey} date:`, error);
        res
          .status(500)
          .json({
            error: `Failed to fetch most recent ${seriesKey} date`,
            details: error.message,
          });
      }
    },

    // Update a date (for manual updates)
    updateRecord: async (req, res) => {
      try {
        const { id } = req.params;
        const { date } = req.body;
        if (!date) return res.status(400).json({ error: "Date is required" });

        const updatedRecord = await Model.findByIdAndUpdate(
          id,
          { date: new Date(date) },
          { new: true }
        );
        if (!updatedRecord)
          return res
            .status(404)
            .json({ error: `Strategic error: ${seriesKey} record not found` });

        res.json({
          message: `${seriesKey} record updated successfully`,
          data: updatedRecord,
        });
      } catch (error) {
        console.error(`Error updating ${seriesKey} record:`, error);
        res
          .status(500)
          .json({
            error: `Failed to update ${seriesKey} record`,
            details: error.message,
          });
      }
    },

    deleteRecords: async (req, res) => {
      try {
        const { date } = req.body;
        if (!date) return res.status(400).json({ error: "Date is required" });

        const deleteDate = new Date(date + "T00:00:00.000Z");
        const result = await Model.deleteMany({ date: { $gte: deleteDate } });
        if (result.deletedCount === 0) {
          return res
            .status(404)
            .json({
              message: `No ${seriesKey} records found from the specified date`,
            });
        }
        res.json({
          message: `Deleted ${result.deletedCount} ${seriesKey} records from ${date} onward`,
        });
      } catch (error) {
        console.error(`Error deleting ${seriesKey} records:`, error);
        res
          .status(500)
          .json({
            error: `Failed to delete ${seriesKey} records`,
            details: error.message,
          });
      }
    },
  };
};

module.exports = createGoogleSheetsController;
