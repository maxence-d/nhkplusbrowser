const renderHtml = (scrapedData) => {
  // Create the HTML structure for each group and generate checkboxes for the panel
  const groupedHtml = scrapedData.map((group, index) => `
    <div class="group" data-group-index="${index}">
      <h2>${group.header}</h2>
      <div class="grid-container">
        ${group.slides.map(item => `
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

  const checkboxes = scrapedData.map((group, index) => `
    <div>
      <input type="checkbox" id="filter-${index}" checked data-group-index="${index}" />
      <label for="filter-${index}">${group.header}</label>
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
          <h3>Exclude Categories</h3>
          <div class="checkbox-container">
            ${checkboxes}
          </div>
        </div>

        <!-- Main content area -->
        <div class="content">
          ${groupedHtml}
        </div>
      </div>

      <script>
        // Handle filtering based on checkboxes
        document.querySelectorAll('.checkbox-container input[type="checkbox"]').forEach(checkbox => {
          checkbox.addEventListener('change', function() {
            const groupIndex = this.getAttribute('data-group-index');
            const groupElement = document.querySelector('.group[data-group-index="' + groupIndex + '"]');
            
            if (this.checked) {
              groupElement.style.display = 'block'; // Show the group
            } else {
              groupElement.style.display = 'none'; // Hide the group
            }
          });
        });

        // Handle collapsible sidebar toggle
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('toggle-sidebar');
        let sidebarVisible = true;

        toggleBtn.addEventListener('click', () => {
          sidebarVisible = !sidebarVisible;
          if (sidebarVisible) {
            sidebar.style.display = 'block';
            toggleBtn.textContent = 'Close Sidebar';
          } else {
            sidebar.style.display = 'none';
            toggleBtn.textContent = 'Open Sidebar';
          }
        });
      </script>
    </body>
    </html>
  `;

  return htmlContent;
};

module.exports = renderHtml;
