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
  let date = new Date(startDate); // create a copy to avoid mutating original
  console.log('workDay-startDate:', startDate, date);
  // If workdays is 0, adjust startDate if it falls on weekend or holiday
  if (workdays === 0) {
    while (isWeekend(date) || isHoliday(date, holidays)) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  }

  // For positive workdays
  while (workdays > 0) {
    date.setDate(date.getDate() + 1);
    if (!isWeekend(date) && !isHoliday(date, holidays)) {
      workdays--;
    }
  }

  return date;
}

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}

function isHoliday(date, holidays) {
  return holidays.some(holiday => holiday.getTime() === date.getTime());
}

function toUTC(date) {
  const utcDate = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  ));
  
  return utcDate;
}

function toExcelDate(date) {
  return 25569 + Math.floor(((date.getTime() - (date.getTimezoneOffset() * 60 * 1000)) / (1000 * 60 * 60 * 24)));
}

module.exports = { getHolidaysFromDB, workDay, isWeekend, isHoliday, toUTC, toExcelDate };