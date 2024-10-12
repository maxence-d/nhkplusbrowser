const { app, BrowserWindow } = require('electron');
const path = require('path');
const handleScrapePage = require('./scrapeHandler');  // Import the scrape handler
const renderHtml = require('./renderHtml');  // Import the render function

let mainWindow;

app.on('ready', async () => {
  // Create a hidden Electron window for scraping
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

  // Start the scraping process in the background
  const scrapedData = await handleScrapePage(mainWindow); // Scrape the data

  // Generate the HTML content with the scraped data
  const htmlContent = renderHtml(scrapedData);

  // Load the generated HTML directly into the main window
  mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`);

  // Show the window after loading the new HTML content
  mainWindow.show();
});
