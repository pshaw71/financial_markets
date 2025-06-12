const { workDay, toUTC } = require('./workdays'); // Adjust the path as needed

//Function that converts B3 expiry codes into actual expiry dates
 function treatedB3Data(currentDate, data, holidays) {
  
   function getB3ExpiryDates(expiryCode, holidays) {
    const monthCodes = ['F', 'G', 'H', 'J', 'K', 'M', 'N', 'Q', 'U', 'V', 'X', 'Z'];
    const month = monthCodes.indexOf(expiryCode.charAt(0));
    const year = parseInt(expiryCode.slice(-2), 10) + 2000;
    const date = toUTC(new Date(year, month, 1));
    const expiryDate = workDay(date, 0, holidays);
    return expiryDate;
  }

  const dataB3 = (data, holidays) => {
    return data.map((innerArray, index) => {
      return [
        toUTC(new Date(getB3ExpiryDates(innerArray[0], holidays))),
        ...innerArray
      ];
    });
  };

  return dataB3(data, holidays);
}

module.exports = { treatedB3Data };
