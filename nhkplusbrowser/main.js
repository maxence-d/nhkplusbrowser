const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const handleScrapePage = require('./scrapeHandler');  // Import the scrape handler
const renderHtml = require('./renderHtml');  // Import the render function

const dataFilePath = path.join(__dirname, 'data.json'); // Path to the data file
let mainWindow;

let file = {
  date: null,
  cb: new Map(),
  data: null
};


// Function to get the current date in Japan time
const getJapanDate = () => {
  const now = new Date();
  const japanTime = new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo' }).format(now);
  return japanTime;
};


const isScrapingNeeded = () => {
  return (!file || !file.date || getJapanDate() !== file.date);
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

  // Load file
  if (fs.existsSync(dataFilePath)) {
    file = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    file.cb ??= {}; // Create if undefined
  }

  // Scrap if needed
  if (isScrapingNeeded()) {
    console.log("Starting the scraping process...");

    // Start the scraping process in the background
    scrapedData = await handleScrapePage(mainWindow);

    // Log the current Japan date after scraping
    file.date = getJapanDate();
    file.data = scrapedData;

    // Add new checkboxes, enabled by default
    file.data.forEach(item => {
      if (!file.cb[item.title]) {
        file.cb[item.title] = "true";
      }
    });

    // Save scraped data
    fs.writeFileSync(dataFilePath, JSON.stringify(file, null, 2), 'utf8');
  }

  // Display data
  
  // Load the previously saved data
  file = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
  
  // Generate the HTML content with the scraped or previously loaded data and checkbox states
  const htmlContent = renderHtml(file);

  // Write the HTML content to a temporary file, so it's easy to find the css
  const tempHtmlPath = path.join(__dirname, 'temp.html');
  fs.writeFileSync(tempHtmlPath, htmlContent);

  // Load the HTML file
  mainWindow.loadFile(tempHtmlPath);

  // Show the window after loading the new HTML content
  mainWindow.show();

  // Handle IPC for checkbox state updates
  ipcMain.on('update-checkbox-state', (event, categoryName, state) => {
    file.cb[categoryName] = state; // Update the checkbox state in the map
  });

  ipcMain.on('reorder-cbs', (event, cbs) => {
    file.cb = cbs;
  });

  ipcMain.on('open-external-link', (event, url) => {
    shell.openExternal(url); // Open the link in the default browser
  });
  // Save checkbox states on application close
  app.on('before-quit', () => {
    fs.writeFileSync(dataFilePath, JSON.stringify(file, null, 2), 'utf8');
  });
});
