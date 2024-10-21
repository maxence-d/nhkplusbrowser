const renderHtml = (file) => {

  // Create the HTML structure for each group and generate checkboxes for the panel
  const playlists = file.data.map((playlist, index) => `
    <div class="playlist" data-playlist="${playlist.title}">
      <div class="playlist-title">
        <input type="checkbox" class="playlist-cb" ${file.cb[playlist.title] ? 'checked' : ''} data-playlist="${playlist.title}" />
        <h2>${playlist.title}</h2>
      </div>
      <div class="playlist-content grid-container" data-playlist="${playlist.title}" ">
          ${playlist.tracks.map(item => `
            <div class="track">
              <a href="${item.href}" target="_blank">
                <img class="track-img" src="${item.thumbnailUrl}" alt="Thumbnail" />
                <h3  class="track-title">${item.title}</h3>
                <p   class="track-duration">${item.duration}分</p>
                <p   class="track-date">${item.broadcastDate}</p>
              </a>
            </div>
          `).join('')}
      </div>
    </div>
  `).join('');
  const checkboxes = Object.entries(file.cb).map(([title, checked]) => `
  <div class="draggable-category" draggable="true" data-playlist="${title}">
    <input type="checkbox" class="playlist-cb" id="filter-${title}" ${checked ? 'checked' : ''} data-playlist="${title}" />
    <label for="filter-${title}">${title}</label>
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
          ${playlists}
        </div>

        <!-- External JS file -->
        <script src="sidebar.js"></script>
        <script>
          reorderCategories();
        </script>
      </body>
    </html>
  `;

  return htmlContent;
};

module.exports = renderHtml;
