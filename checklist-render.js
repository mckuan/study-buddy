const input = document.querySelector('.input-text');
const checklistItemsContainer = document.querySelector('.checklist-items');
const completeItemsContainer = document.querySelector('.complete-items');

let checklistItems = JSON.parse(localStorage.getItem('checklistItems')) || [];
let completeItems = JSON.parse(localStorage.getItem('completeItems')) || [];

function renderChecklist() {

  //Render active tasks
  checklistItemsContainer.innerHTML = '';
  checklistItems.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('checklist-item');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = false;
    checkbox.addEventListener('change', () => {
      const currItem = checklistItems[index];
      currItem.completed = true;
      checklistItems.splice(index, 1);
      completeItems.push(currItem);
      saveChecklistItems();
      renderChecklist();
    });
    
    const text = document.createElement('span');
    text.textContent = item.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.classList.add('delete-btn')
    deleteBtn.addEventListener('click', () => {
      checklistItems.splice(index, 1); 
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
  completeItems.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('complete-item');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.addEventListener('change', () => {
      const currItem = completeItems[index];
      currItem.completed = false;
      completeItems.splice(index, 1);
      checklistItems.push(currItem); 
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
      completeItems.splice(index, 1);
      saveChecklistItems();
      renderChecklist();
    });

    itemElement.appendChild(checkbox);
    itemElement.appendChild(text);
    itemElement.appendChild(deleteBtn);
    completeItemsContainer.appendChild(itemElement);
  }); 
}

function saveChecklistItems() {
  localStorage.setItem('checklistItems', JSON.stringify(checklistItems));
  localStorage.setItem('completeItems', JSON.stringify(completeItems));
}

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && input.value.trim() !== '') {
    checklistItems.push({ text: input.value.trim(), completed: false });
    input.value = '';
    saveChecklistItems();
    renderChecklist();
  }
});

renderChecklist();