const renderHtml = (scrapedData) => {
  // Create the grid of clickable images using the scraped data
  const imageGrid = scrapedData.map(item => `
    <div class="grid-item">
      <a href="${item.href}" target="_blank">
        <img src="${item.thumbnailUrl}" alt="Thumbnail" />
        <p>Duration: ${item.duration}</p>
        <p>Date: ${item.broadcastDate}</p>
      </a>
    </div>
  `).join('');

  // Construct the HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Scraped Data</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          padding: 20px;
        }
        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        .grid-item {
          text-align: center;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 10px;
          background-color: #fff;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .grid-item img {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
        }
        .grid-item p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <h1>Scraped Data</h1>
      <div class="grid-container">
        ${imageGrid}
      </div>
    </body>
    </html>
  `;

  return htmlContent;
};

module.exports = renderHtml;
