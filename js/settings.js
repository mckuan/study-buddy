
const settingsBtn = document.querySelector('.settings-btn');
const settings = document.querySelector('.settings');
const blur = document.querySelector('.blur');
const closesettings = document.querySelector('.settings-close');
const blockingToggle = document.querySelector('#allow-blocking');
const alwaysOnTopToggle = document.querySelector('#always-on-top');
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
  alwaysOnTopToggle.checked =
    await ipcRenderer.invoke('get-always-on-top');
  ipcRenderer.send('get-blocking-enabled');
  blockedsites = await ipcRenderer.invoke('get-blocked-sites');
  renderDropdown();
});

closesettings.addEventListener('click', () => {
  blur.style.display = 'none';
  settings.style.display = 'none';
});

// ---------------- ALWAYS ON TOP ----------------

alwaysOnTopToggle.addEventListener('change', () => {
  ipcRenderer.send('toggle-always-on-top', {enabled: alwaysOnTopToggle.checked});
});

// ---------------- BLOCKING ----------------

// Reflect the persisted state when settings opens
ipcRenderer.on('blocking-enabled-state', (_, { enabled }) => {
  blockingToggle.checked = enabled;
});

blockingToggle.addEventListener('change', () => {
  ipcRenderer.send('settings-toggle-blocking', { enabled: blockingToggle.checked });
});

ipcRenderer.on('settings-toggle-success', (_, { enabled }) => {
  blockingToggle.checked = enabled;
});

ipcRenderer.on('settings-toggle-failed', (_, { wrongPassword }) => {
  blockingToggle.checked = false; 
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