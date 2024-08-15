document.addEventListener("DOMContentLoaded", function () {
    const spreadsheetContainer = document.getElementById("spreadsheet-container");
    const fontSizeInput = document.getElementById("font-size");
    const searchInput = document.getElementById("search");
    const filterInput = document.getElementById("filter");
    const clearFilterBtn = document.getElementById("clear-filter");
    const alignLeftBtn = document.getElementById("align-left");
    const alignCenterBtn = document.getElementById("align-center");
    const alignRightBtn = document.getElementById("align-right");
    const undoBtn = document.getElementById("undo");
    const redoBtn = document.getElementById("redo");
    const prevPageBtn = document.getElementById("prev-page");
    const nextPageBtn = document.getElementById("next-page");
    const currentPageSpan = document.getElementById("current-page");
  
    const totalCells = 100000;
    const pageSize = 1008; // Show 100 cells per page
    let currentPage = 1;
    let cellData = new Map(); // Store cell data in memory
    let history = []; // History stack for undo/redo
    let redoStack = []; // Stack for redo actions
  
    // Generate grid cells
    function renderGrid(page) {
      spreadsheetContainer.innerHTML = ""; // Clear previous grid
      const startIdx = (page - 1) * pageSize;
      const endIdx = startIdx + pageSize;
  
      for (let i = startIdx; i < endIdx && i < totalCells; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
  
        const input = document.createElement("input");
        input.type = "text";
        input.dataset.cellId = i;
  
        // Restore previous cell data if available
        if (cellData.has(i)) {
          input.value = cellData.get(i);
        }
  
        // Handle cell input with validation
        input.addEventListener("input", (e) => {
          const cellId = parseInt(e.target.dataset.cellId);
  
          // Example: Numeric validation for cells with IDs divisible by 5
          if (cellId % 5 === 0 && isNaN(e.target.value)) {
            alert("Only numeric values are allowed in this cell!");
            e.target.value = ""; // Clear the input if invalid
            return;
          }
  
          // Save the previous state for undo
          history.push({ id: cellId, value: cellData.get(cellId) || "" });
  
          // Update the cell data
          cellData.set(cellId, e.target.value);
  
          // Clear the redo stack after a new action
          redoStack = [];
        });
  
        cell.appendChild(input);
        spreadsheetContainer.appendChild(cell);
      }
    }
  
    // Pagination Controls
    function updatePagination() {
      currentPageSpan.textContent = `Page ${currentPage}`;
      prevPageBtn.disabled = currentPage === 1;
      nextPageBtn.disabled = currentPage * pageSize >= totalCells;
    }
  
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderGrid(currentPage);
        updatePagination();
      }
    });
  
    nextPageBtn.addEventListener("click", () => {
      if (currentPage * pageSize < totalCells) {
        currentPage++;
        renderGrid(currentPage);
        updatePagination();
      }
    });
  
    // Font size adjustment
    fontSizeInput.addEventListener("change", function () {
      const cells = document.querySelectorAll(".cell input");
      cells.forEach(cell => {
        cell.style.fontSize = `${fontSizeInput.value}px`;
      });
    });
  
    // Text alignment
    alignLeftBtn.addEventListener("click", () => setAlignment("left"));
    alignCenterBtn.addEventListener("click", () => setAlignment("center"));
    alignRightBtn.addEventListener("click", () => setAlignment("right"));
  
    function setAlignment(alignment) {
      const cells = document.querySelectorAll(".cell input");
      cells.forEach(cell => {
        cell.style.textAlign = alignment;
      });
    }
  
    // Search functionality
    searchInput.addEventListener("input", function () {
      const searchValue = searchInput.value.toLowerCase();
      const cells = document.querySelectorAll(".cell input");
      cells.forEach(cell => {
        const cellValue = cell.value.toLowerCase();
        if (cellValue.includes(searchValue)) {
          cell.parentElement.style.backgroundColor = "#e1ffc7"; // Highlight matched cells
        } else {
          cell.parentElement.style.backgroundColor = "#fff";
        }
      });
    });
  
    // Undo/Redo functionality
    undoBtn.addEventListener("click", () => {
      if (history.length === 0) return;
      const lastAction = history.pop();
      redoStack.push({ id: lastAction.id, value: cellData.get(lastAction.id) });
      cellData.set(lastAction.id, lastAction.value);
  
      const input = document.querySelector(`[data-cell-id="${lastAction.id}"]`);
      if (input) input.value = lastAction.value;
    });
  
    redoBtn.addEventListener("click", () => {
      if (redoStack.length === 0) return;
      const lastRedo = redoStack.pop();
      history.push({ id: lastRedo.id, value: cellData.get(lastRedo.id) });
      cellData.set(lastRedo.id, lastRedo.value);
  
      const input = document.querySelector(`[data-cell-id="${lastRedo.id}"]`);
      if (input) input.value = lastRedo.value;
    });
  
    // Filter functionality
    filterInput.addEventListener("input", function () {
      const filterValue = filterInput.value.toLowerCase();
      const cells = document.querySelectorAll(".cell input");
      cells.forEach(cell => {
        const cellValue = cell.value.toLowerCase();
        if (cellValue.includes(filterValue)) {
          cell.parentElement.style.display = "flex"; // Show matched cells
        } else {
          cell.parentElement.style.display = "none"; // Hide non-matched cells
        }
      });
    });
  
    // Clear filter
    clearFilterBtn.addEventListener("click", function () {
      filterInput.value = ""; // Clear the filter input
      const cells = document.querySelectorAll(".cell input");
      cells.forEach(cell => {
        cell.parentElement.style.display = "flex"; // Show all cells
      });
    });
  
    // Initial grid render and pagination setup
    renderGrid(currentPage);
    updatePagination();
  });
  