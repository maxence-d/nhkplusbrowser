const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const handleScrapePage = require('./scrapeHandler');  // Import the scrape handler
const renderHtml = require('./renderHtml');  // Import the render function

let mainWindow;
const dataFilePath = path.join(__dirname, 'data.json'); // Path to the data file

// Function to get the current date in Japan time
const getJapanDate = () => {
  const now = new Date();
  const japanTime = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo' }).format(now);
  return japanTime;
};

// Function to check if scraping is needed
const isScrapingNeeded = () => {
  if (!fs.existsSync(dataFilePath)) {
    return true; // If the data file doesn't exist, we need to scrape
  }

  const logData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  const lastScrapeDate = logData.lastScrapeDate;
  
  const currentJapanDate = getJapanDate();
  return currentJapanDate !== lastScrapeDate; // Scrape if the date is different from the last scrape date
};

// Function to log the current scrape date in Japan time
const logScrapeDate = () => {
  const currentJapanDate = getJapanDate();
  const logData = {
    lastScrapeDate: currentJapanDate
  };
  fs.writeFileSync(dataFilePath, JSON.stringify(logData), 'utf8');
};

app.on('ready', async () => {
  // Create the Electron window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false, // Window is hidden during scraping
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  let scrapedData;

  // Check if scraping is needed based on the Japan time zone
  if (isScrapingNeeded()) {
    console.log("Starting the scraping process...");
    
    // Start the scraping process in the background
    scrapedData = await handleScrapePage(mainWindow);

    // Log the current Japan date after scraping
    logScrapeDate();

    // Save the scraped data to data.json
    fs.writeFileSync(dataFilePath, JSON.stringify({ lastScrapeDate: getJapanDate(), data: scrapedData }), 'utf8');
  } else {
    console.log("Scraping is not needed. Loading the previously scraped data...");

    // Load the previously saved data
    const logData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    scrapedData = logData.data; // Access the previously scraped data
  }

  // Generate the HTML content with the scraped or previously loaded data
  const htmlContent = renderHtml(scrapedData);

  // Write the HTML content to a temporary file
  const tempHtmlPath = path.join(__dirname, 'temp.html');
  fs.writeFileSync(tempHtmlPath, htmlContent);

  // Load the HTML file
  mainWindow.loadFile(tempHtmlPath);
  
  // Show the window after loading the new HTML content
  mainWindow.show();
});
