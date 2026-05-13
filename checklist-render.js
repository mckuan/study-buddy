const input = document.querySelector('.input-text');
const checklistItemsContainer = document.querySelector('.checklist-items');

let checklistItems = JSON.parse(localStorage.getItem('checklistItems')) || [];

function renderChecklist() {
  checklistItemsContainer.innerHTML = '';
  checklistItems.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('checklist-item');
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.completed;
    checkbox.addEventListener('change', () => {
      checklistItems[index].completed = checkbox.checked;
      saveChecklistItems();
      renderChecklist();
    });
    
    const text = document.createElement('span');
    text.textContent = item.text;
    if (item.completed) {
      text.style.textDecoration = 'line-through';
      text.style.color = '#aaa';
    }

    const deleteBtn = document.createElement('button'); // ✅ delete button
    deleteBtn.textContent = 'x';
    deleteBtn.style.marginLeft = 'auto';
    deleteBtn.addEventListener('click', () => {
      checklistItems.splice(index, 1); // ✅ removes item at that index
      saveChecklistItems();
      renderChecklist();
    });
    
    itemElement.appendChild(checkbox);
    itemElement.appendChild(text);
    itemElement.appendChild(deleteBtn); // ✅ added to element
    
    checklistItemsContainer.appendChild(itemElement);
  });
}

function saveChecklistItems() {
  localStorage.setItem('checklistItems', JSON.stringify(checklistItems));
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
