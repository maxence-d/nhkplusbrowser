
setupCollapseButtons();

// Handle filtering based on checkboxes and initialize category visibility
document.querySelectorAll('.checkbox-container input[type="checkbox"]').forEach(checkbox => {
    const category = checkbox.getAttribute('data-category');
    const groupElement = document.querySelector('.group[data-group-name="' + category + '"]');

    // Initialize visibility based on checkbox state
    if (!checkbox.checked) {
        groupElement.style.display = 'none'; // Hide the group if checkbox is unchecked
    }

    // Add event listener for checkbox changes
    checkbox.addEventListener('change', function () {
        if (this.checked) {
            groupElement.style.display = 'block'; // Show the group when checked
        } else {
            groupElement.style.display = 'none'; // Hide the group when unchecked
        }

        // Send IPC message to update checkbox state in the main process
        window.ipcRenderer.send('update-checkbox-state', category, this.checked);
    });
});

// Enable drag and drop reordering
const draggableItems = document.querySelectorAll('.draggable-category');
const draggableContainer = document.getElementById('draggable-container');

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
    });

    item.addEventListener('drop', function (e) {
        e.preventDefault();
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

function setupCollapseButtons() {
    const toggleFiltersBtn = document.getElementById('toggle-filters');
    const checkboxContainer = document.querySelector('.checkbox-container');
    let filtersVisible = false; // Start with filters hidden

    toggleFiltersBtn.addEventListener('click', () => {
        filtersVisible = !filtersVisible;
        if (filtersVisible) {
            checkboxContainer.style.display = 'block';
            toggleFiltersBtn.textContent = 'Hide Filters';
        } else {
            checkboxContainer.style.display = 'none';
            toggleFiltersBtn.textContent = 'Show Filters';
        }
    });
}
// Function to reorder categories in the main panel
function reorderCategories() {
    const categoriesOrder = Array.from(draggableContainer.querySelectorAll('.draggable-category'))
        .map(item => item.getAttribute('data-group-name'));

    const mainContent = document.getElementById('main-content');
    categoriesOrder.forEach(category => {
        const groupElement = document.querySelector('.group[data-group-name="' + category + '"]');
        mainContent.appendChild(groupElement);
    });
}
