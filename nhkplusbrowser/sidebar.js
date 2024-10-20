setupFiltering();
setupOrdering();
setupSidebarButton();

function setupSidebarButton() {
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
}

function setupFiltering() {
    let checkboxes = document.querySelectorAll("input.playlist-cb");
    for(let checkbox of checkboxes){
        const playlistTitle = checkbox.getAttribute('data-playlist');
        const playlistContent = document.querySelector(`.playlist-content[data-playlist="${playlistTitle}"]`);

        // Show/Hide on page load
        if(!checkbox.checked){
            playlistContent.style.display = 'none';
        }
        
        // Show/Hide on click
        checkbox.addEventListener('change', function () {
            const isChecked = this.checked;
            if (isChecked) {
                playlistContent.style.display = 'grid'; // Show the group when checked
            } else {
                playlistContent.style.display = 'none'; // Hide the group when unchecked
            }

            // sync all checkboxes for this playlist
            const checkboxes = document.querySelectorAll(`input.playlist-cb[data-playlist="${playlistTitle}"]`);
            for(let checkbox of checkboxes){
                checkbox.checked = isChecked;
            }

            window.ipcRenderer.send('update-checkbox-state', playlistTitle, this.checked);
        });
        
        
    }
}

function setupOrdering() {

    // Enable drag and drop reordering
    const draggableItems = document.querySelectorAll('.draggable-category');
    const draggableContainer = document.getElementById('filters');

    let draggedItem = null;

    draggableItems.forEach(item => {
        item.addEventListener('dragstart', function () {
            draggedItem = this;
            setTimeout(() => {
                this.style.display = 'none';
            }, 0);
        });

        item.addEventListener('dragend', function () {
            setTimeout(() => {
                draggedItem.style.display = 'block';
                draggedItem = null;
            }, 0);
        });

        item.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.classList.add('drag-over'); // Add a visual highlight to the item being dragged over
        });

        item.addEventListener('dragleave', function () {
            this.classList.remove('drag-over'); // Remove the highlight when the dragged item leaves
        });

        item.addEventListener('drop', function (e) {
            e.preventDefault();
            this.classList.remove('drag-over'); // Remove the highlight on drop

            if (draggedItem !== this) {
                let allItems = Array.from(draggableContainer.querySelectorAll('.draggable-category'));
                let draggedIndex = allItems.indexOf(draggedItem);
                let droppedIndex = allItems.indexOf(this);

                if (draggedIndex < droppedIndex) {
                    this.after(draggedItem);
                } else {
                    this.before(draggedItem);
                }

                // Update the order in the main content panel
                reorderCategories();
            }
        });
    });

}

// Function to reorder categories in the main panel
function reorderCategories() {
    const draggableContainer = document.getElementById('filters');
    const categoriesOrder = Array.from(draggableContainer.querySelectorAll('.draggable-category'))
        .map(item => item.getAttribute('data-group-name'));

    const mainContent = document.getElementById('main-content');
    categoriesOrder.forEach(category => {
        const groupElement = document.querySelector('.group[data-group-name="' + category + '"]');
        mainContent.appendChild(groupElement);
    });
}
