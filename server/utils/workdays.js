const Holiday = require('../models/holidaysbr_dates'); // Adjust path as needed to your Holiday model

const getHolidaysFromDB = async () => {
  try {
    const holidays = await Holiday.find({}); // Fetch all documents from the holidays collection
    const holidayDates = holidays.map(holiday => holiday.date);
    return holidayDates; // Returns an array of Date objects
  } catch (error) {
    console.error('Error retrieving holidays from DB:', error);
    throw new Error('Failed to retrieve holiday dates during startup.');
  }
};

function workDay(startDate, workdays, holidays) {
  let endDate = startDate;

  while (workdays > 0) {
    endDate.setDate(endDate.getDate() + 1);
    if (!isWeekend(endDate) && !isHoliday(endDate, holidays)) {
      workdays--;
    }
  }

  return endDate;
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isHoliday(date, holidays) {
  return holidays.some(holiday => holiday.getTime() === date.getTime());
}



module.exports = { getHolidaysFromDB, workDay, isWeekend, isHoliday };