// ── DOM references ────────────────────────────────────────

const input = document.querySelector('.input-text');
const checklistItemsContainer = document.querySelector('.checklist-items');
const completeItemsContainer = document.querySelector('.complete-items');
const dateBtn = document.querySelector('.date-btn');
const dropdown = document.querySelector('.dropdown');
const checklistclose = document.querySelector('.checklist-close');

// ── state ─────────────────────────────────────────────────

const date = new Date();
let dateKey = getDateKey(0); // default to today

let checklistItems = {}; // pending tasks, keyed by date string
let completeItems = {};  // completed tasks, keyed by date string

// set initial date button label
dateBtn.textContent = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ▾';

// ── init ──────────────────────────────────────────────────

// load persisted data from main process via electron-store, then render
(async () => {
  checklistItems = await window.api.getChecklist();
  completeItems = await window.api.getCompletelist();
  renderChecklist();
  renderDateOptions();
})();

// ── persistence ───────────────────────────────────────────

// persist both lists to electron-store via IPC
function saveChecklistItems() {
  window.api.saveChecklist({ checklistItems, completeItems });
}

// ── date key ──────────────────────────────────────────────

// returns a YYYY-MM-DD date string for today + offset days.
// uses local date parts instead of ISO string to avoid UTC shifting the date.
function getDateKey(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ── render ────────────────────────────────────────────────

// rebuilds both the pending and completed task lists from state for the active dateKey.
// called after any state change (add, complete, delete, date switch).
function renderChecklist() {
  // ensure arrays exist for this date before rendering
  checklistItems[dateKey] = checklistItems[dateKey] || [];
  completeItems[dateKey] = completeItems[dateKey] || [];

  // ── pending tasks ──────────────────────────────────────

  checklistItemsContainer.innerHTML = '';
  checklistItems[dateKey].forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('checklist-item');

    // checking the box moves the item to completeItems
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = false;
    checkbox.addEventListener('change', () => {
      const currItem = checklistItems[dateKey][index];
      currItem.completed = true;
      checklistItems[dateKey].splice(index, 1);
      completeItems[dateKey].push(currItem);
      saveChecklistItems();
      renderChecklist();
    });

    const text = document.createElement('span');
    text.textContent = item.text;

    // delete button permanently removes the task
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
      checklistItems[dateKey].splice(index, 1);
      saveChecklistItems();
      renderChecklist();
    });

    itemElement.appendChild(checkbox);
    itemElement.appendChild(text);
    itemElement.appendChild(deleteBtn);
    checklistItemsContainer.appendChild(itemElement);
  });

  // ── completed tasks ────────────────────────────────────

  completeItemsContainer.innerHTML = '';
  completeItems[dateKey].forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('complete-item');

    // unchecking moves the item back to checklistItems
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.addEventListener('change', () => {
      const currItem = completeItems[dateKey][index];
      currItem.completed = false;
      completeItems[dateKey].splice(index, 1);
      checklistItems[dateKey].push(currItem);
      saveChecklistItems();
      renderChecklist();
    });

    // strikethrough styling applied inline to mark task as done
    const text = document.createElement('span');
    text.textContent = item.text;
    text.style.textDecoration = 'line-through';
    text.style.color = '#aaa';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
      completeItems[dateKey].splice(index, 1);
      saveChecklistItems();
      renderChecklist();
    });

    itemElement.appendChild(checkbox);
    itemElement.appendChild(text);
    itemElement.appendChild(deleteBtn);
    completeItemsContainer.appendChild(itemElement);
  });
}

// ── add task ──────────────────────────────────────────────

// pressing Enter on the input adds a new pending task for the active date
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && input.value.trim() !== '') {
    checklistItems[dateKey] = checklistItems[dateKey] || [];
    checklistItems[dateKey].push({ text: input.value.trim(), completed: false });
    input.value = '';
    input.placeholder = 'Add new task...';
    saveChecklistItems();
    renderChecklist();
  }
});

// ── date picker ───────────────────────────────────────────

// clicking the date button shows the dropdown and hides the button itself.
// guard on e.target prevents child elements from triggering this accidentally.
dateBtn.addEventListener('click', (e) => {
  if (e.target === dateBtn) {
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
    dateBtn.style.display = 'none';
  }
});

// populates the date dropdown with buttons for today + next few days.
// selecting a date updates dateKey and re-renders the checklist for that day.
function renderDateOptions() {
  const dayButtons = dropdown.querySelectorAll('button');
  dayButtons.forEach((btn, index) => {
    const optionDate = new Date();
    optionDate.setDate(date.getDate() + index);
    btn.textContent = optionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    btn.addEventListener('click', () => {
      dateBtn.textContent = btn.textContent + ' ▾';
      input.value = '';
      input.placeholder = 'Add new task...';
      dropdown.style.display = 'none';
      dateBtn.style.display = 'block';
      dateKey = getDateKey(index);
      renderChecklist();
    });
  });
}

// ── window focus ──────────────────────────────────────────

// any click in the checklist window refocuses it via IPC,
// preventing the main window from stealing focus
document.addEventListener('click', () => {
  window.api.focusChecklist();
});