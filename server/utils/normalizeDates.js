const { format } = require("path");

// Helper to format Date object to dd/mm/yyyy
const formatDateBR = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error('Invalid date provided to formatDateBR');
  }
  return `${date.getUTCDate().toString().padStart(2, '0')}/${(date.getUTCMonth() + 1).toString().padStart(2, '0')}/${date.getUTCFullYear()}`;
};

// Helper to format 'dd/mm/yyyy' date to Date object
const formatBRDate = (brDate) => {
  if (typeof brDate !== 'string' || !/^\d{2}\/\d{2}\/\d{4}$/.test(brDate)) {
    throw new Error(`Invalid date string format: ${brDate}. Expected dd/mm/yyyy`);
  }
  const [day, month, year] = brDate.split('/').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (isNaN(date)) {
    throw new Error(`Invalid date values: ${brDate}`);
  }
  return date;
};

// Normalize dates with database fallback
const normalizeDates = async (Model, startDate, endDate, defaultStartDate) => {
  let startDateObj;
  try {
    if (startDate) {
      startDateObj = formatBRDate(startDate);
    } else {
      const mostRecent = await Model.findOne().sort({ date: -1 });
      if (mostRecent && mostRecent.date) {
        startDateObj = new Date(mostRecent.date);
        startDateObj.setUTCDate(startDateObj.getUTCDate() + 1);
      } else {
        startDateObj = formatBRDate(defaultStartDate);
      }
    }
  } catch (error) {
    console.warn(`Start date normalization failed: ${error.message}, using default`);
    startDateObj = formatBRDate(defaultStartDate);
  }
  console.log('startDateObj:', startDateObj);

  let endDateObj;
  try {
    if (endDate) {
      endDateObj = formatBRDate(endDate);
    } else {
      endDateObj = new Date(); // Today
      endDateObj.setUTCHours(0, 0, 0, 0); // Set to midnight UTC
    }

    const maxEndDateObj = new Date(startDateObj);
    maxEndDateObj.setUTCFullYear(startDateObj.getUTCFullYear() + 9); // 9 years data period

    if (endDateObj > maxEndDateObj) {
      endDateObj = maxEndDateObj;
    }

    if (endDateObj < startDateObj) {
      endDateObj = startDateObj;
    }
  } catch (error) {
    console.warn(`End date normalization failed: ${error.message}, using today capped at 10 years`);
    endDateObj = new Date();
    endDateObj.setUTCHours(0, 0, 0, 0);
    const maxEndDateObj = new Date(startDateObj);
    maxEndDateObj.setUTCFullYear(startDateObj.getUTCFullYear() + 10);
    endDateObj = endDateObj > maxEndDateObj ? maxEndDateObj : endDateObj;
    if (endDateObj < startDateObj) endDateObj = startDateObj;
  }
  console.log('endDateObj:', endDateObj);

  return {
    startDate: formatDateBR(startDateObj),
    endDate: formatDateBR(endDateObj)
  };
};

module.exports = { normalizeDates, formatDateBR, formatBRDate }; // Export all for flexibility