const { treatBcbData } = require('../utils/treatBcbData');
const bcbAPI_URL = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.'
const BCB_SERIES = require('../config/dataseries-codes');
const { normalizeDates, formatDateBR, formatBRDate } = require('../utils/normalizeDates');

// Factory function to create controllers for BCB date-value data
const createBcbDateValueController = (Model, seriesKey) => {
  const sgsCode = BCB_SERIES[seriesKey];
  console.log(seriesKey);
  console.log('SGS Code:', sgsCode);
  
  if (!sgsCode) {
    throw new Error(`Invalid BCB series key: ${seriesKey}`);
  }

  return {
    // Fetch and store BCB date-value data
    getData: async (req, res) => {
      try {
        const { startDate, endDate } = req.query || {};
        
        console.log(req.query);
        console.log(Object.keys(req.query).length)

        const { startDate: normalizedStart, endDate: normalizedEnd } = await normalizeDates(
          Model,
          startDate,
          endDate,
          '30/06/1994'
        );
        console.log('Start Date:', normalizedStart);
        console.log('End Date:', normalizedEnd);
        
        // Fetch data from BCB API
        const url = `${bcbAPI_URL}${sgsCode}/dados?formato=json&dataInicial=${normalizedStart}&dataFinal=${normalizedEnd}`;
        console.log(url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const treatedData = treatBcbData(data);

        // Save to MongoDB
        await Model.insertMany(treatedData, { ordered: true });
        res.status(200).json({ message: 'Data fetched and stored successfully', data: treatedData });

      } catch (error) {
        console.error('Error fetching BCB data:', error);
        res.status(500).json({ error: 'Failed to process data', details: error.message });
      }
    },

    // Fetch data from MongoDB
    getAllRecords: async (req, res) => {
      try {
        const { startDate, endDate } = req.query;
        let query = {};
        if (startDate || endDate) {
          query.date = {};
          if (startDate) query.date.$gte = new Date(startDate);
          if (endDate) query.date.$lte = new Date(endDate);
        }
        const records = await Model.find(query).sort({ date: -1 });
        res.json(records);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch records' });
      }
    },

    // Fetch most recent record date
    getMostRecentDate: async (req, res) => {
      try {
        const mostRecent = await Model.findOne().sort({ date: -1 });
        if (!mostRecent) {
          return res.json({ date: null, message: 'No data available' });
        }
        res.json({ date: mostRecent.date });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch most recent date', details: error.message });
      }
    },

    // Update a record by ID
    updateRecord: async (req, res) => {
      try {
        const { id } = req.params;
        const { date, value } = req.body;
        const updatedRecord = await Model.findByIdAndUpdate(
          id,
          { date: new Date(date), value: parseFloat(value) },
          { new: true }
        );
        if (!updatedRecord) {
          return res.status(404).json({ error: 'Record not found' });
        }
        res.json({ message: 'Record updated successfully', data: updatedRecord });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update record', details: error.message });
      }
    },

    // Delete a record by ID
    deleteRecord: async (req, res) => {
      try {
        const { id } = req.params;
        const result = await Model.findByIdAndDelete(id);
        if (!result) {
          return res.status(404).json({ error: 'Record not found' });
        }
        res.json({ message: 'Record deleted successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete record', details: error.message });
      }
    },

    // Delete all records from a certain date
    deleteRecordsFromDate: async (req, res) => {
      try {
        console.log('deleteRecordsFromDate - Request body:', req.body);
        const { date } = req.body;
        if (!date) {
          return res.status(400).json({ error: 'Date was not informed!' });
        }
  
        const deleteDate = new Date(date + 'T00:00:00.000Z');
        console.log('deleteDate (ISO):', deleteDate.toISOString());
  
        const result = await Model.deleteMany({ date: { $gte: deleteDate } });
        console.log('Delete result:', result);
  
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'No records found from the specified date' });
        }
        res.json({ message: `Deleted ${result.deletedCount} records from ${date} onward` });
      } catch (error) {
        res.status(500).json({ error: 'Failed to delete records', details: error.message });
      }
    }
  }
  
};

module.exports = createBcbDateValueController;


