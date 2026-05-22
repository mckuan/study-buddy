const settingsBtn = document.querySelector('.settings-btn');
const settings = document.querySelector('.settings');
const blur = document.querySelector('.blur');
const closesettings = document.querySelector('.settings-close');
const toggle = document.querySelector('.toggle-input');
const dropdownBtn = document.querySelector('.dropdown-button');
const dropdown = document.querySelector('.dropdown');
const errorPopup = document.querySelector('.error-popup');
const blockedContainer = document.querySelector('.sites');
const inputContainer = document.querySelector('.input-text');

let blockedsites = [];

// ---------------- SETTINGS ----------------

settingsBtn.addEventListener('click', async () => {
  blur.style.display = 'block';
  settings.style.display = 'block';
  ipcRenderer.send('get-blocking-enabled');
  blockedsites = await ipcRenderer.invoke('get-blocked-sites');
  renderDropdown();
});

closesettings.addEventListener('click', () => {
  blur.style.display = 'none';
  settings.style.display = 'none';
});

ipcRenderer.on('blocking-enabled-state', (_, { enabled }) => {
  toggle.checked = enabled;
});

toggle.addEventListener('change', () => {
  ipcRenderer.send('settings-toggle-blocking', {
    enabled: toggle.checked
  });
});

ipcRenderer.on('settings-toggle-success', () => {
  toggle.checked = true;
});

ipcRenderer.on('settings-toggle-failed', (_, { wrongPassword }) => {
  toggle.checked = false;
  if (wrongPassword) {
    errorPopup.style.display = 'block';
    setTimeout(() => errorPopup.style.display = 'none', 3000);
  }
});

// ---------------- BLOCKED SITES ----------------

dropdownBtn.addEventListener('click', () => {
  dropdown.style.display = dropdown.style.display === 'flex' ? 'none' : 'flex';
});

function renderDropdown() {
  blockedContainer.innerHTML = '';
  blockedsites.forEach((site, index) => {
    const siteElement = document.createElement('div');
    siteElement.classList.add('site-item');
    siteElement.textContent = site;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'x';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', () => {
      blockedsites.splice(index, 1);
      ipcRenderer.send('update-blocked-sites', blockedsites);
      renderDropdown();
    });

    siteElement.appendChild(deleteBtn);
    blockedContainer.appendChild(siteElement);
  });
}

inputContainer.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && inputContainer.value.trim()) {
    blockedsites.push(inputContainer.value.trim());
    ipcRenderer.send('update-blocked-sites', blockedsites);
    inputContainer.value = '';
    renderDropdown();
  }
});