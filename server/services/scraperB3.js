// import { workDay, fetchHolidaysFromGoogleSheets, treatedB3Data } from '../utils/datesB3.js';
// import pkg from 'selenium-webdriver'; 
const { treatedB3Data } = require('../utils/datesB3'); // Importing the function to treat B3 data
const pkg = require('selenium-webdriver'); // Importing the selenium-webdriver package
const { Builder, By, until, Select } = pkg; 

//----------------------------------------------------------------
export async function scrapeDI1DataFromB3(date) {
  console.log('FetchDate1: ' + date);
  // let aggregatedData = null;

  // Launch the Selenium browser session
  const driver = await new Builder().forBrowser('chrome').build();

  // Set timeout for each loading page
  const timeout = 3000; // 3.0 secs

  try {
    // Go to the URL
    const url = 'https://www.b3.com.br/pt_br/market-data-e-indices/servicos-de-dados/market-data/consultas/boletim-diario/boletim-diario-do-mercado/';
    await driver.get(url);

    // Switch to the iframe containing the required elements
    const frame = await driver.wait(until.elementLocated(By.css('iframe')), timeout);
    await driver.switchTo().frame(frame);

    // Wait for the 'Cotações' button to be clickable
    const cotacoesButton = await driver.wait(until.elementLocated(By.linkText('COTAÇÕES')), timeout);
    await cotacoesButton.click();

    // Wait for the 'Resumo Estatistico' link to be clickable
    const resumoEstatisticoLink = await driver.wait(until.elementLocated(By.linkText('Resumo Estatístico')), 10000);
    await resumoEstatisticoLink.click();

    // Select the "DI1" option from the dropdown menu
    const selectElement = await driver.findElement(By.css('select[id="selectTabelas"]'));
    await selectElement.sendKeys('DI1Day@false');
    await driver.sleep(timeout); // Wait for the page to load after selecting

    // Set the date input value
    // Get date already input in the field
    const dateInput = await driver.wait(until.elementLocated(By.css('input[class="duet-date__input"]')), timeout);
    const currentDate = await dateInput.getAttribute('value');
    console.log('currentDate: ', currentDate);

    function formatDate(date) {
      console.log(date);
      const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
      //const monthNames1 = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const monthNames1 = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      const day = date.getUTCDate();
      const month = date.getUTCMonth();
      const year = date.getUTCFullYear();
      return {
        day: day.toString(),
        month: month.toString(),
        year: year.toString(),
        date: `${day} de ${monthNames[month]}`,
        dateXPath: `'${day} de ${monthNames[month]}'`,
        dateB3: `${day.toString().padStart(2, '0')}/${(month+1).toString().padStart(2, '0')}/${year}`,
        monthName: monthNames1[month]
      }
    }

    // Execute JavaScript to change the value, *and* trigger a change event
    const formattedDate = formatDate(new Date(date));
    console.log('test: ', formattedDate.dateB3.toString(), currentDate.toString());

    let dateAvailable = false;
    
    // if (formattedDate.dateB3 !== currentDate) {
    if (formattedDate.dateB3.toString() !== currentDate.toString()) {
      const dateButtons = await driver.findElements(By.css('button[class="duet-date__toggle"]'));
      // console.log('dateButton: ', dateButtons);
      await dateButtons[2].click();

      // Select Year ----> To be implemented only 2025 is available now
      const yearSelect = await driver.findElements(By.css('select[class="duet-date__select--year"]'));
      // console.log('yearSelect: ', yearSelect);
      const select = new Select(yearSelect[2]);
      select.selectByVisibleText(formattedDate.year);
      //await yearSelect[2].selectByVisibleText('2024');

      // Select Month
      const monthSelect = await driver.findElements(By.css('select[class="duet-date__select--month"]'));
      // console.log('monthSelect: ', monthSelect);
      const selectMonth = new Select(monthSelect[2]);
      //await monthSelect[2].sendKeys(`${formattedDate.month}`);
      await selectMonth.selectByVisibleText(formattedDate.monthName);

      //Select day
      //const xpathText = `//button[text(${formattedDate.date}))]`;
      const xpathText = `//button[contains(., ${formattedDate.dateXPath})]`;
      // console.log('xpathText: ',xpathText);
      const dayButtons = await driver.findElements(By.xpath(xpathText));
      //const dayButtons = await driver.findElements(By.xpath(`//button[contains(., '4 de janeiro')]`));
      //const dayButtons = await driver.findElements(By.css('button:contains("4 de fevereiro")'));
      //const dayButtons = await driver.findElement(By.xpath(`//button[text()='4 de fevereiro']`));
      // console.log('dayButtons.length: ', dayButtons.length);
      // console.log('dayButtons: ', dayButtons);

      // Scroll into view before interacting with the element
      await driver.executeScript("arguments[0].scrollIntoView(true);", monthSelect[2]);    
      //const dayButtonsElem = (dayButtons.length - dayButtons.length / 3);
      //await dayButtons[dayButtonsElem].click();
      
      for (let i = 0; i < dayButtons.length; i++) {
        const classStr = await dayButtons[i].getAttribute("class");
        const classArray = classStr.split(" ");
        // console.log('dayButtons[i]: ', classArray);
        if (classArray.includes("is-month") && !classArray.includes("is-disabled")) {
          // console.log('classArray.includes("is-month"): ', i);
          const childElems = await dayButtons[i].findElements(By.xpath('./*'));
          const innerText = await childElems[1].getText();
          //const innerTextArray = innerText.split(" ");
          console.log('innerText: ', innerText);
          console.log('innerText == formattedDate.date: ', innerText.toString() , formattedDate.date.toString());
          if (innerText.toString() == formattedDate.date.toString()) {  
            await dayButtons[i].click();
            dateAvailable = true;
            break;
          }
        }
      }
    }

    if (!dateAvailable) {
      console.log(`Data for ${formattedDate.date} not available`);
      return
    }
    // Retrieve data from table
    const table = await driver.findElement(By.css('table[id="custom-tbl"]'));
    // console.log('table:', table);
    const allData = [];

    //const rows = Array.from(table.querySelectorAll('tr'));
    const rows = await table.findElements(By.tagName('tr'));
    // console.log('rows:', rows[0]);
    for (let i = 0; i < rows.length - 1; i++) { // Iterate up to the second-last row
      const row = rows[i];
      const cells = await row.findElements(By.tagName('td')); 
      const rowData = await Promise.all(cells.map(async (cell) => await cell.getText())); 

      if (rowData.length > 0) {
        allData.push(rowData); 
      }
    }

    const parseBrNumber = (brNumber) => {
      if (brNumber === '-') return 0;
      return parseFloat(brNumber.replace(/\./g, '').replace(',', '.'));
    };

    const convertToNumbers = (data) => {
      return data.map(innerArray =>
        innerArray.map((element, index) =>
          index === 0 ? element : parseBrNumber(element)
        )
      );
    };

    const adjustedData =  convertToNumbers(allData);
    console.log('adjustedData:', adjustedData);
    return adjustedData;

  } catch (error) {
    console.error('Error scraping data:', error);

  } finally {
    // Close the browser session

    await driver.quit();
  }
}

//----------------------------------------------------------------
export async function fetchB3TreatedData(date) {
  if (!date) {
    console.log('Date not informed!!!');
    return
  }
  const holidays = req.app.locals.holidays;
  const rawData = await scrapeDI1DataFromB3(date);
  console.log('FetchedData: ', rawData);
  if (rawData) {
    const treatedData = treatedB3Data(date, rawData, holidays);
    return treatedData;
  } else {
    const treatedData = undefined;
  }

}

// console.log(scrapeDI1DataFromB3('2025-06-03'));