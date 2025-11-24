init();

function init() {
  // Initialize CodeMirror
  const editor = CodeMirror.fromTextArea(document.getElementById('jsonInput'), {
    mode: "application/json",
    theme: "dracula",
    lineNumbers: true,
    autoCloseBrackets: true,
    lineWrapping: true,
    tabSize: 2,
  });

  const DEMO_DATA =[{"name": "Alice","role": "Engineer","status": "Active"},{"name": "Bob","role": "Designer","status": "Away"}];

  // Set initial value
  editor.setValue(JSON.stringify(DEMO_DATA, null, 2));

  const errorMessage = document.getElementById('errorMessage');
  const dataTable = document.getElementById('dataTable');
  const emptyState = document.querySelector('.empty-state');
  const rowCount = document.getElementById('rowCount');
  const tableHead = dataTable.querySelector('thead');
  const tableBody = dataTable.querySelector('tbody');

  // Resizable Pane Logic
  const gutter = document.getElementById('gutter');
  const inputPane = document.getElementById('inputPane');
  const mainContent = document.getElementById('mainContent');
  let isDragging = false;

  const savedInputPaneHeight = localStorage.getItem('DataVisualizerPaneHeight');
  if (savedInputPaneHeight) {
    inputPane.style.height = `${savedInputPaneHeight}%`;
  }

  gutter.addEventListener('mousedown', (e) => {
    isDragging = true;
    gutter.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const containerRect = mainContent.getBoundingClientRect();
    const newHeight = e.clientY - containerRect.top;
    
    const minHeight = 100;
    const maxHeight = containerRect.height - 100;

    if (newHeight >= minHeight && newHeight <= maxHeight) {
      const percentage = (newHeight / containerRect.height) * 100;
      inputPane.style.height = `${percentage}%`;
      localStorage.setItem('DataVisualizerPaneHeight', percentage);
    }
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      gutter.classList.remove('dragging');
      document.body.style.cursor = 'default';
      // Refresh CodeMirror layout after resize
      editor.refresh();
    }
  });

  // Window resize handler to ensure editor refreshes
  window.addEventListener('resize', () => {
    editor.refresh();
  });

  let currentData = [];
  let sortCol = null;
  let sortAsc = true;
  
  editor.on("change", () => {
    changeHandler();
  });

  function changeHandler() {
    const rawValue = editor.getValue().trim();
    
    if (!rawValue) {
      showError("Please enter some JSON data.");
      return;
    }

    try {
      const parsedData = JSON.parse(rawValue);
      
      if (!Array.isArray(parsedData)) {
        showError("Input must be a JSON Array (start with '[' and end with ']').");
        return;
      }

      if (parsedData.length === 0) {
        showError("Array is empty.");
        return;
      }

      // Normalize data: find all unique keys
      const allKeys = new Set();
      parsedData.forEach(item => {
        if (typeof item === 'object' && item !== null) {
          Object.keys(item).forEach(k => allKeys.add(k));
        }
      });

      if (allKeys.size === 0) {
        showError("No valid objects found in the array.");
        return;
      }

      currentData = parsedData;
      errorMessage.style.display = 'none';
      emptyState.style.display = 'none';
      dataTable.style.display = 'table';
      rowCount.textContent = `${currentData.length} records`;
      
      renderTable(Array.from(allKeys));

    } catch (e) {
      showError("Invalid JSON: " + e.message);
    }
  }
  
  function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.style.display = 'block';
  }

  function renderTable(keys) {
    // Clear existing
    tableHead.innerHTML = '';
    tableBody.innerHTML = '';

    // Create Header
    const headerRow = document.createElement('tr');
    keys.forEach(key => {
      const th = document.createElement('th');
      th.textContent = key;
      th.dataset.key = key;
      
      // Sort Icon
      const icon = document.createElement('span');
      icon.className = 'sort-icon';
      icon.innerHTML = '&#8693;'; // Up/Down arrow
      th.appendChild(icon);

      th.addEventListener('click', () => handleSort(key, keys));
      headerRow.appendChild(th);
    });
    tableHead.appendChild(headerRow);

    renderRows(keys);
  }

  function renderRows(keys) {
    tableBody.innerHTML = '';
    currentData.forEach(item => {
      const tr = document.createElement('tr');
      keys.forEach(key => {
        const td = document.createElement('td');
        const val = item[key];
        
        if (val === null) {
          td.textContent = 'null';
          td.style.fontStyle = 'italic';
          td.style.opacity = '0.5';
        } else if (typeof val === 'object') {
          td.textContent = JSON.stringify(val);
          td.style.fontFamily = 'monospace';
          td.style.fontSize = '0.85em';
        } else {
          td.textContent = String(val);
        }
        
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });
  }

  function handleSort(key, keys) {
    if (sortCol === key) {
      sortAsc = !sortAsc;
    } else {
      sortCol = key;
      sortAsc = true;
    }

    // Update Icons
    const ths = tableHead.querySelectorAll('th');
    ths.forEach(th => {
      const icon = th.querySelector('.sort-icon');
      if (th.dataset.key === key) {
        icon.innerHTML = sortAsc ? '&#8593;' : '&#8595;'; // Up or Down arrow
        icon.style.color = 'var(--primary-color)';
      } else {
        icon.innerHTML = '&#8693;';
        icon.style.color = '';
      }
    });

    // Sort Data
    currentData.sort((a, b) => {
      const valA = a[key];
      const valB = b[key];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();

      if (strA < strB) return sortAsc ? -1 : 1;
      if (strA > strB) return sortAsc ? 1 : -1;
      return 0;
    });

    renderRows(keys);
  }
  
  changeHandler();
}