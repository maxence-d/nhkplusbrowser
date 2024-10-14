const renderHtml = (scrapedData, checkboxStates) => {
  
  // Create the HTML structure for each group and generate checkboxes for the panel
  const groupedHtml = scrapedData.map((playlist, index) => `
    <div class = "playlist-header">
      <h2>${playlist.header}</h2>
    </div>
    <div class="playlist-content" data-group-name="${playlist.header}" data-group-index="${index}">
      <div class="grid-container">
        ${playlist.slides.map(item => `
          <div class="grid-item">
            <a href="${item.href}" target="_blank">
              <img src="${item.thumbnailUrl}" alt="Thumbnail" />
              <h3>${item.title}</h3>
              <p>Duration: ${item.duration}</p>
              <p>Date: ${item.broadcastDate}</p>
            </a>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');

  const checkboxes = scrapedData.map((playlist) => `
    <div class="draggable-category" draggable="true" data-group-name="${playlist.header}">
      <input type="checkbox" id="filter-${playlist.header}" ${checkboxStates[playlist.header] ? 'checked' : ''} data-category="${playlist.header}" />
      <label for="filter-${playlist.header}">${playlist.header}</label>
    </div>
  `).join('');

  // Construct the full HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Scraped Data with Filters</title>
      <link rel="stylesheet" href="styles/styles.css"> <!-- Link to external CSS -->
    </head>
    <body>
      <!-- Top panel with sidebar toggle button -->
      <div class="top-panel">
        <button id="toggle-sidebar" class="toggle-btn">Close Sidebar</button>
      </div>

      <!-- Main layout for sidebar and content -->
      <div class="main-layout">
        <!-- Sidebar with filters -->
        <div class="sidebar" id="sidebar">
          <div class="draggable-container" id="filters">
            ${checkboxes}
          </div>
        </div>

        <!-- Main content area -->
        <div class="content" id="main-content">
          ${groupedHtml}
        </div>

        <!-- External JS file -->
        <script src="sidebar.js"></script>
      </body>
    </html>
  `;

  return htmlContent;
};

module.exports = renderHtml;
