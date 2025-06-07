//Function that converts B3 expiry codes into actual expiry dates
 function treatedB3Data(currentDate, data, holidays) {
  function getB3ExpiryDates(expiryCode, holidays) {
    const monthCodes = ['F', 'G', 'H', 'J', 'K', 'M', 'N', 'Q', 'U', 'V', 'X', 'Z'];
    const month = monthCodes.indexOf(expiryCode.charAt(0));
    const year = parseInt(expiryCode.slice(-2), 10) + 2000;
    const date = new Date(year, month, 1);

    return workDay(new Date(date.getTime() - 24 * 60 * 60 * 1000), 1, holidays).toDateString();
  }

  const dataB3 = (data, holidays) => {
    const excelDate = toExcelDate(toUTC(new Date(currentDate)));

    return data.map((innerArray, index) => {
      return [
        excelDate * 100 + index,
        excelDate, 
        //getB3ExpiryDates(innerArray[0], holidays), 
        toExcelDate(toUTC(new Date(getB3ExpiryDates(innerArray[0], holidays)))),
        ...innerArray
      ];
    });
  };

  return dataB3(data, holidays);
}

function toUTC(date) {
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return utcDate;
}

function toExcelDate(date) {
  return 25569 + Math.floor(((date.getTime() - (date.getTimezoneOffset() * 60 * 1000)) / (1000 * 60 * 60 * 24)));
}

module.exports = { treatedB3Data, toExcelDate, toUTC };
