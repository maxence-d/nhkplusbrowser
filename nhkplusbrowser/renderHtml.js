const renderHtml = (file) => {
// Create the HTML structure for each group and generate checkboxes for the panel
const playlists = file.data.map((playlist, index) => `
  <div class="playlist" data-playlist="${playlist.title}">
    <div class="playlist-title">
      <input type="checkbox" class="playlist-cb" ${file.cb[playlist.title] ? 'checked' : ''} data-playlist="${playlist.title}" />
      <h2>${playlist.title}</h2>
    </div>
    <div class="playlist-content row g-3" data-playlist="${playlist.title}">
        ${playlist.tracks.map(item => `
          <div class="col-3 track text-bg-secondary me-3">
            <div class="row">
              <p class="col track-duration">${item.duration}分</p>
              <p class="col track-date">${item.broadcastDate}</p>
            </div>
            <a href="${item.href}" target="_blank">
              <img class="track-img img-fluid" src="${item.thumbnailUrl}" alt="Thumbnail" />
              <div class="row">
              <p class="track-title" style="overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; line-height: 1.5; height: calc(1.5em * 3);">${item.title}</p>
              </div>
            </a>
          </div>
        `).join('')}
    </div>
  </div>
`).join('');

  const checkboxes = Object.entries(file.cb).map(([title, checked]) => `
  <li>
  <div class="draggable-category" draggable="true" data-playlist="${title}">
    <input type="checkbox" class="playlist-cb" id="filter-${title}" ${checked ? 'checked' : ''} data-playlist="${title}" />
    <label for="filter-${title}">${title}</label>
  </div>
  </li>
`).join('');

  //<link rel="stylesheet" href="styles/styles.css"> <!-- Link to external CSS -->
  // Construct the full HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Scraped Data with Filters</title>
      <link rel="stylesheet" href="./node_modules/bootstrap/dist/css/bootstrap.min.css">
    </head>
    <body class="text-bg-dark">
      <div class="navbar bg-dark">
      <ul class="navbar-nav">
      <li class="nav-item">
        <button type="button" class="btn btn-primary" id="toggle-sidebar">Close Sidebar</button>
      </li>
      </ul>
      </div>

      <!-- Main layout for sidebar and content -->
      <div class="container">
        <div class="row">
        
            <div class="col-sm-2 sidebar" id="sidebar">
              <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
                Filters
              </button>
              
              <div class="collapse show" id="home-collapse">
              <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                ${checkboxes}
              </ul>
              </div>
            </div>

            <!-- Main content area -->
            <div class="col-sm-10 content" id="main-content">
              ${playlists}
            </div>

        </div>
      </div>

        <!-- External JS file -->
        <script src="sidebar.js"></script>
        <script>
          reorderCategories();
        </script>
        <script src="./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
        <script>
            document.addEventListener('click', function (event) {
            const target = event.target.closest('a'); // Check if a link was clicked
            if (target && target.href) {
              event.preventDefault(); // Prevent Electron from handling the link
              window.ipcRenderer.send('open-external-link', target.href); // Send link to main process
            }
          });
        </script>
      </body>
    </html>
  `;



  return htmlContent;
};

module.exports = renderHtml;
