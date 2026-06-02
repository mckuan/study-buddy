const input = document.querySelector('.input-text');
const checklistItemsContainer = document.querySelector('.checklist-items');
const completeItemsContainer = document.querySelector('.complete-items');
const dateBtn = document.querySelector('.date-btn');
const dropdown = document.querySelector('.dropdown');
const checklistclose = document.querySelector('.checklist-close');
const date = new Date();
let dateKey = getDateKey(0);

dateBtn.textContent = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ▾';

// loading — make the init async
let checklistItems = {};
let completeItems = {};

(async () => {
  checklistItems = await window.api.getChecklist();
  completeItems = await window.api.getCompletelist();
  renderChecklist();
  renderDateOptions();
})();

// saving
function saveChecklistItems() {
  window.api.saveChecklist({ checklistItems, completeItems });
}

console.log('loaded:', checklistItems);

function getDateKey(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  // Use local date parts instead of ISO string (which is UTC)
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function renderChecklist() {
  checklistItems[dateKey] = checklistItems[dateKey] || [];
  completeItems[dateKey] = completeItems[dateKey] || [];
  
  checklistItemsContainer.innerHTML = '';
  checklistItems[dateKey].forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('checklist-item');
    
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

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.classList.add('delete-btn')
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

  //Render completed tasks
  completeItemsContainer.innerHTML = '';
  completeItems[dateKey].forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('complete-item');

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

    const text = document.createElement('span');
    text.textContent = item.text;
    text.style.textDecoration = 'line-through';
    text.style.color = '#aaa';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.classList.add('delete-btn')
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

dateBtn.addEventListener('click', (e) => {
  if (e.target === dateBtn) {
    dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
    dateBtn.style.display = 'none';
  }
});

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

document.addEventListener('click', (e) => {
  window.api.focusChecklist();
});
