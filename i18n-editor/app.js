// State Management
let state = {
  sourceData: {},      // Flattened source language key-value pairs
  targetData: {},      // Flattened target language key-value pairs
  sourceKeys: [],      // Sorted list of keys from the source file
  originalFilename: '', // Name of the loaded translation file (e.g. 'ru.json')
  currentPage: 1,
  pageSize: 25,
  searchQuery: '',
  activeFilter: 'all', // 'all', 'missing', 'translated'
  editedKeys: new Set() // Tracks keys that have been modified during this session
};

// DOM Elements
const stepSource = document.getElementById('step-source');
const stepTranslation = document.getElementById('step-translation');
const editorView = document.getElementById('editor-view');
const sourceDropZone = document.getElementById('source-drop-zone');
const translationDropZone = document.getElementById('translation-drop-zone');
const sourceFileInput = document.getElementById('source-file-input');
const translationFileInput = document.getElementById('translation-file-input');
const btnCreateNew = document.getElementById('btn-create-new');
const sourceFileBadgeText = document.getElementById('source-file-badge-text');

const filenameInput = document.getElementById('filename-input');
const progressText = document.getElementById('progress-text');
const progressPercentage = document.getElementById('progress-percentage');
const progressBarFill = document.getElementById('progress-bar-fill');
const searchInput = document.getElementById('search-input');
const filterTabs = document.querySelectorAll('.filter-tab');
const translationList = document.getElementById('translation-list');
const emptyState = document.getElementById('empty-state');
const paginationInfo = document.getElementById('pagination-info');
const paginationControls = document.getElementById('pagination-controls');
const pageSizeSelect = document.getElementById('page-size-select');
const btnSave = document.getElementById('btn-save');

// --- Helper Functions ---

// Flatten nested JSON object into a single-level object with dot-notation keys
function flattenObject(obj, prefix = '') {
  let result = {};
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      let propName = prefix ? `${prefix}.${key}` : key;
      // Exclude null values from object recursion, treat arrays as leaf nodes
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(result, flattenObject(obj[key], propName));
      } else {
        result[propName] = obj[key] !== null && obj[key] !== undefined ? String(obj[key]) : '';
      }
    }
  }
  return result;
}

// Unflatten dot-notation keys back into a nested JSON object structure
function unflattenObject(flatObj) {
  let result = {};
  for (let key in flatObj) {
    if (Object.prototype.hasOwnProperty.call(flatObj, key)) {
      let keys = key.split('.');
      let current = result;
      for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        if (i === keys.length - 1) {
          current[k] = flatObj[key];
        } else {
          // If the nested property doesn't exist or is not a plain object, initialize it
          if (!current[k] || typeof current[k] !== 'object' || Array.isArray(current[k])) {
            current[k] = {};
          }
          current = current[k];
        }
      }
    }
  }
  return result;
}

// Adjust height of textarea dynamically based on text length
function adjustTextareaHeight(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

// Format date-time for the output filename
function getFormattedDateTime() {
  const now = new Date();
  const pad = num => String(num).padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${year}${month}${day}-${hours}${minutes}${seconds}`;
}

// --- File Handling & Loading ---

// Setup Drag & Drop Handlers
function setupDragAndDrop(dropZone, fileInput, onFileLoaded) {
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleFile(files[0], onFileLoaded);
    }
  }, false);

  fileInput.addEventListener('change', (e) => {
    if (fileInput.files.length > 0) {
      handleFile(fileInput.files[0], onFileLoaded);
    }
  });
}

function handleFile(file, onFileLoaded) {
  if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
    alert('Please upload a valid JSON file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const json = JSON.parse(e.target.result);
      onFileLoaded(json, file.name);
    } catch (err) {
      alert('Error parsing JSON file. Please check file formatting.');
      console.error(err);
    }
  };
  reader.readAsText(file);
}

// Step 1: Load Source File (en.json)
setupDragAndDrop(sourceDropZone, sourceFileInput, (json, filename) => {
  state.sourceData = flattenObject(json);
  state.sourceKeys = Object.keys(state.sourceData).sort();
  
  sourceFileBadgeText.textContent = `${filename} loaded (${state.sourceKeys.length} keys)`;
  
  // Transition to Step 2
  stepSource.classList.add('hidden');
  stepTranslation.classList.remove('hidden');
});

// Step 2: Load Target File
setupDragAndDrop(translationDropZone, translationFileInput, (json, filename) => {
  const flatTarget = flattenObject(json);
  state.originalFilename = filename;
  
  // Pre-fill targetData with source keys, mapping existing values
  state.targetData = {};
  state.sourceKeys.forEach(key => {
    state.targetData[key] = flatTarget[key] !== undefined ? flatTarget[key] : '';
  });
  
  // Carry over any extra target keys that weren't in source, just in case
  for (let key in flatTarget) {
    if (state.targetData[key] === undefined) {
      state.targetData[key] = flatTarget[key];
    }
  }

  startEditor();
});

// Step 2: Create New Translation File
btnCreateNew.addEventListener('click', () => {
  state.originalFilename = 'translation.json';
  
  // Initialize with empty translation strings for all source keys
  state.targetData = {};
  state.sourceKeys.forEach(key => {
    state.targetData[key] = '';
  });

  startEditor();
});

function startEditor() {
  stepTranslation.classList.add('hidden');
  editorView.classList.remove('hidden');
  
  filenameInput.value = state.originalFilename;
  
  updateStats();
  renderList();
}

// --- Editor Logic & Rendering ---

function updateStats() {
  const total = state.sourceKeys.length;
  let translatedCount = 0;
  
  state.sourceKeys.forEach(key => {
    if (state.targetData[key] !== undefined && state.targetData[key].trim() !== '') {
      translatedCount++;
    }
  });

  const percent = total > 0 ? Math.round((translatedCount / total) * 100) : 0;
  
  progressText.textContent = `${translatedCount} / ${total} translated`;
  progressPercentage.textContent = `(${percent}%)`;
  progressBarFill.style.width = `${percent}%`;
}

function getFilteredKeys() {
  return state.sourceKeys.filter(key => {
    const sourceVal = state.sourceData[key] || '';
    const targetVal = state.targetData[key] || '';
    
    // Filter Tab Check
    if (state.activeFilter === 'missing') {
      if (targetVal.trim() !== '') return false;
    } else if (state.activeFilter === 'translated') {
      if (targetVal.trim() === '') return false;
    }

    // Search Query Check
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase();
      const keyMatch = key.toLowerCase().includes(q);
      const sourceMatch = sourceVal.toLowerCase().includes(q);
      const targetMatch = targetVal.toLowerCase().includes(q);
      return keyMatch || sourceMatch || targetMatch;
    }

    return true;
  });
}

function renderList() {
  const filtered = getFilteredKeys();
  const totalItems = filtered.length;
  
  if (totalItems === 0) {
    translationList.classList.add('hidden');
    emptyState.classList.remove('hidden');
    document.querySelector('.pagination-container').classList.add('hidden');
    return;
  }

  translationList.classList.remove('hidden');
  emptyState.classList.add('hidden');
  document.querySelector('.pagination-container').classList.remove('hidden');

  // Pagination calculation
  const totalPages = Math.ceil(totalItems / state.pageSize);
  if (state.currentPage > totalPages) {
    state.currentPage = Math.max(1, totalPages);
  }

  const startIndex = (state.currentPage - 1) * state.pageSize;
  const endIndex = Math.min(startIndex + state.pageSize, totalItems);
  const pageKeys = filtered.slice(startIndex, endIndex);

  // Update pagination info text
  paginationInfo.textContent = `Showing ${startIndex + 1}-${endIndex} of ${totalItems} keys`;

  // Render cards
  translationList.innerHTML = '';
  pageKeys.forEach(key => {
    const card = createKeyCard(key);
    translationList.appendChild(card);
    
    // Adjust height on textareas after inserting into DOM
    const textarea = card.querySelector('.translation-textarea');
    adjustTextareaHeight(textarea);
  });

  renderPaginationControls(totalPages);
}

function createKeyCard(key) {
  const sourceVal = state.sourceData[key] || '';
  const targetVal = state.targetData[key] || '';
  const isEdited = state.editedKeys.has(key);
  const isTranslated = targetVal.trim() !== '';

  const card = document.createElement('div');
  card.className = `key-card ${isEdited ? 'edited' : ''} ${!isTranslated ? 'empty' : ''}`;
  
  // Status info HTML
  let statusDotClass = 'status-dot';
  let statusText = 'Missing';
  if (isTranslated) {
    statusDotClass += ' active-success';
    statusText = 'Translated';
  } else {
    statusDotClass += ' active-warning';
  }

  card.innerHTML = `
    <div class="key-card-header">
      <span class="key-badge">${escapeHtml(key)}</span>
      <div class="status-indicator">
        <span class="${statusDotClass}"></span>
        <span class="status-text">${statusText}</span>
      </div>
    </div>
    <div class="key-card-body">
      <div class="source-container">
        <div class="field-label">
          <span>Source (en.json)</span>
          <button type="button" class="btn-copy-source" title="Copy source value to translation">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>
        <div class="source-value">${escapeHtml(sourceVal)}</div>
      </div>
      <div class="target-container">
        <div class="field-label">Translation</div>
        <div class="textarea-container">
          <textarea class="translation-textarea" autocomplete="off" spellcheck="false" placeholder="Enter translation...">${escapeHtml(targetVal)}</textarea>
          <button type="button" class="btn-clear-field" title="Clear field">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  const textarea = card.querySelector('.translation-textarea');
  const copyBtn = card.querySelector('.btn-copy-source');
  const clearBtn = card.querySelector('.btn-clear-field');

  // Input listener to update target value
  textarea.addEventListener('input', () => {
    state.targetData[key] = textarea.value;
    state.editedKeys.add(key);
    card.classList.add('edited');
    
    // Update card visual translation status
    const hasValue = textarea.value.trim() !== '';
    const dot = card.querySelector('.status-dot');
    const textStatus = card.querySelector('.status-text');
    
    if (hasValue) {
      card.classList.remove('empty');
      dot.className = 'status-dot active-success';
      textStatus.textContent = 'Translated';
    } else {
      card.classList.add('empty');
      dot.className = 'status-dot active-warning';
      textStatus.textContent = 'Missing';
    }

    adjustTextareaHeight(textarea);
    updateStats();
  });

  // Copy source event
  copyBtn.addEventListener('click', () => {
    textarea.value = sourceVal;
    textarea.dispatchEvent(new Event('input'));
  });

  // Clear field event
  clearBtn.addEventListener('click', () => {
    textarea.value = '';
    textarea.dispatchEvent(new Event('input'));
  });

  return card;
}

function renderPaginationControls(totalPages) {
  paginationControls.innerHTML = '';
  
  if (totalPages <= 1) return;

  // Previous Page Button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.disabled = state.currentPage === 1;
  prevBtn.innerHTML = `
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
  `;
  prevBtn.addEventListener('click', () => {
    state.currentPage--;
    renderList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  paginationControls.appendChild(prevBtn);

  // Page Numbers
  const maxButtons = 5;
  let startPage = Math.max(1, state.currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  if (startPage > 1) {
    const firstBtn = document.createElement('button');
    firstBtn.className = 'page-btn';
    firstBtn.textContent = '1';
    firstBtn.addEventListener('click', () => {
      state.currentPage = 1;
      renderList();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    paginationControls.appendChild(firstBtn);

    if (startPage > 2) {
      const dots = document.createElement('span');
      dots.textContent = '...';
      dots.style.margin = '0 0.25rem';
      dots.style.color = 'var(--text-muted)';
      paginationControls.appendChild(dots);
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-btn ${state.currentPage === i ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      state.currentPage = i;
      renderList();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    paginationControls.appendChild(pageBtn);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      const dots = document.createElement('span');
      dots.textContent = '...';
      dots.style.margin = '0 0.25rem';
      dots.style.color = 'var(--text-muted)';
      paginationControls.appendChild(dots);
    }

    const lastBtn = document.createElement('button');
    lastBtn.className = 'page-btn';
    lastBtn.textContent = totalPages;
    lastBtn.addEventListener('click', () => {
      state.currentPage = totalPages;
      renderList();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    paginationControls.appendChild(lastBtn);
  }

  // Next Page Button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn';
  nextBtn.disabled = state.currentPage === totalPages;
  nextBtn.innerHTML = `
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
    </svg>
  `;
  nextBtn.addEventListener('click', () => {
    state.currentPage++;
    renderList();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  paginationControls.appendChild(nextBtn);
}

// Escape HTML utility to prevent XSS
function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Event Listeners ---

// Search query input handler
searchInput.addEventListener('input', (e) => {
  state.searchQuery = e.target.value;
  state.currentPage = 1;
  renderList();
});

// Filter tabs click handlers
filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    state.activeFilter = tab.getAttribute('data-filter');
    state.currentPage = 1;
    renderList();
  });
});

// Page size selector handler
pageSizeSelect.addEventListener('change', (e) => {
  state.pageSize = parseInt(e.target.value, 10);
  state.currentPage = 1;
  renderList();
});

// Handle window resizing to recalculate textarea heights dynamically
window.addEventListener('resize', () => {
  const textareas = document.querySelectorAll('.translation-textarea');
  textareas.forEach(adjustTextareaHeight);
});

// Save button action
btnSave.addEventListener('click', () => {
  // Get finalized filename
  let filename = filenameInput.value.trim();
  if (!filename) {
    filename = 'translation.json';
  }
  if (!filename.endsWith('.json')) {
    filename += '.json';
  }

  // Construct export filename: {datetime}-{originalname}.json
  const timestamp = getFormattedDateTime();
  const finalFilename = `${timestamp}-${filename}`;

  // Unflatten dictionary
  const unflattened = unflattenObject(state.targetData);
  const jsonString = JSON.stringify(unflattened, null, 2);
  
  // Download file trigger
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});
