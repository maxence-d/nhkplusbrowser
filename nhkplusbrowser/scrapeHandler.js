const fs = require('fs');

const handleScrapePage = async (mainWindow) => {
  // Load the target URL
  await mainWindow.loadURL('https://plus.nhk.jp/');

  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  await wait(500);  


  // Scroll to the bottom of the page to load all dynamic content
  await mainWindow.webContents.executeJavaScript(`
    new Promise((resolve) => {
        let totalHeight = 0;
        const distance = window.innerHeight;
        
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 200);
   
    }); 
  `);

  // Wait for additional content to load
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Extract and group data by playlist-header
  const extractedData = await mainWindow.webContents.executeJavaScript(`
    (function() {
      const data = [];
      let currentGroup = null;

      document.querySelectorAll('.playlist-header, .swiper-slide').forEach(element => {
        if (element.classList.contains('playlist-header')) {
          // If it's a playlist-header, start a new group
          const headerText = element.querySelector('h3') ? element.querySelector('h3').textContent.trim() : 'Unknown Group';
          currentGroup = { 
            title: headerText, 
            tracks: [] 
          };
          data.push(currentGroup);
        } else if (element.classList.contains('swiper-slide') && currentGroup) {
          // If it's a swiper-slide, add it to the current group
          const anchor = element.querySelector('a');
          const thumbnail = anchor ? anchor.querySelector('figure img') : null; // Correctly navigate to <img> in <figure>
          const titleElem = element.querySelector('h3'); // Extract the h3 text for each swiper-slide
          const title = titleElem ? titleElem.textContent.trim() : 'No Title';
          const durationElem = element.querySelector('p'); // Assuming duration is in <p>
          const programDateElem = element.querySelector('.program_modat');

          currentGroup.tracks.push({
            href: anchor ? anchor.href : null,
            thumbnailUrl: thumbnail ? thumbnail.src : null, // Get the src from the <img>
            title: title, // Add the h3 title
            duration: durationElem ? durationElem.textContent.trim().replace('分', '') : null,
            broadcastDate: programDateElem ? programDateElem.textContent.trim().split('(')[0] : null,
          });
        }
      });

      return data;
    })();
  `);


  // Return the grouped data
  return extractedData;
};

module.exports = handleScrapePage;
