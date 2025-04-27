const express = require('express');
const router = express.Router();
const createGoogleSheetsController = require('../controllers/googleSheets');
const HolidayBR_Model = require('../models/holidaysbr_dates');
const COPOM_Model = require('../models/copom_dates');
const IPCA_Dates_Model = require('../models/ipca_dates');

const controllers = {
  holidaysbr_dates: createGoogleSheetsController(HolidayBR_Model, 'holidaysbr_dates'),
  copom_dates: createGoogleSheetsController( COPOM_Model, 'copom'),
  ipca_dates: createGoogleSheetsController(IPCA_Dates_Model, 'ipca_dates')
};

// Google Sheets routes for BR holidays
router.get('/holidaysbr_dates/google-sheets', controllers.holidaysbr_dates.getRecordsFromSheets);
router.get('/holidaysbr_dates/records', controllers.holidaysbr_dates.getAllRecords);
router.patch('/holidaysbr_dates/records/:id', controllers.holidaysbr_dates.updateRecord);
router.get('/holidaysbr_dates/most-recent-date', controllers.holidaysbr_dates.getMostRecentRecord);
router.delete('/holidaysbr_dates/records/delete-from', controllers.holidaysbr_dates.deleteRecords);

// Google Sheets routes for COPOM dates
router.get('/copom_meeting_dates/google-sheets', controllers.copom_dates.getRecordsFromSheets);
router.get('/copom_meeting_dates/records', controllers.copom_dates.getAllRecords);
router.patch('/copom_meeting_dates/records/:id', controllers.copom_dates.updateRecord);
router.get('/copom_meeting_dates/most-recent-date', controllers.copom_dates.getMostRecentRecord);
router.delete('/copom_meeting_dates/records/delete-from', controllers.copom_dates.deleteRecords);

// Google Sheets routes for IPCA dates
router.get('/ipca_divulgation_dates/google-sheets', controllers.ipca_dates.getRecordsFromSheets);
router.get('/ipca_divulgation_dates/records', controllers.ipca_dates.getAllRecords);
router.patch('/ipca_divulgation_dates/records/:id', controllers.ipca_dates.updateRecord);
router.get('/ipca_divulgation_dates/most-recent-date', controllers.ipca_dates.getMostRecentRecord);
router.delete('/ipca_divulgation_dates/records/delete-from', controllers.ipca_dates.deleteRecords);

module.exports = router;