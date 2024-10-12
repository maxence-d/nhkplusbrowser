const fs = require('fs');

// Define the handler function for scraping
const onScrape = async (mainWindow) => {
  // Load the target URL
  await mainWindow.loadURL('https://plus.nhk.jp/');

  // Scroll to the bottom of the page
  await mainWindow.webContents.executeJavaScript(`
    new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 200;
      const timer = setInterval(() => {
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  `);

  // Wait for additional content to load
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Get the HTML content of the page
  const pageHTML = await mainWindow.webContents.executeJavaScript(`
    document.documentElement.outerHTML
  `);

  // Save the HTML content to a file
  fs.writeFileSync('page.html', pageHTML, 'utf8');
  console.log('HTML saved!');
};

// Export the handler as a function
module.exports = onScrape;
