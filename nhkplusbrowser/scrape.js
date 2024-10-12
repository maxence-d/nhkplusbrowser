const fs = require('fs');

const handleScrapePage = async (mainWindow) => {
  // Load the target URL
  await mainWindow.loadURL('https://plus.nhk.jp/');

  // Scroll to the bottom of the page to load all dynamic content
  await mainWindow.webContents.executeJavaScript(`
    new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
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

  // Extract data from each swiper-slide element
  const extractedData = await mainWindow.webContents.executeJavaScript(`
    Array.from(document.querySelectorAll('.swiper-slide')).map(slide => {
      const anchor = slide.querySelector('a');
      const thumbnail = anchor ? anchor.querySelector('figure img') : null; // Correctly navigate to <img> in <figure>
      const durationElem = slide.querySelector('p'); // Assuming duration is in <p>
      const programDateElem = slide.querySelector('.program_modat');

      return {
        href: anchor ? anchor.href : null,
        thumbnailUrl: thumbnail ? thumbnail.src : null,
        duration: durationElem ? durationElem.textContent.trim().replace('分', ' minutes') : null,
        broadcastDate: programDateElem ? programDateElem.textContent.trim() : null,
      };
    });
  `);

  // Save the extracted data to a JSON file
  fs.writeFileSync('extracted_data.json', JSON.stringify(extractedData, null, 2), 'utf8');
  console.log('Data extracted and saved as extracted_data.json.');

  // Optional: You can return this data for further processing if needed
  return extractedData;
};

module.exports = handleScrapePage;
