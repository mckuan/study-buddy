
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
    await window.api.getAlwaysOnTop();
  blockingToggle.checked = await window.api.getBlockingEnabled();
  blockedsites = await window.api.getBlockedSites();
  renderDropdown();
});

closesettings.addEventListener('click', () => {
  blur.style.display = 'none';
  settings.style.display = 'none';
});

// ---------------- ALWAYS ON TOP ----------------

alwaysOnTopToggle.addEventListener('change', () => {
  window.api.toggleAlwaysOnTop(alwaysOnTopToggle.checked);
});

// ---------------- BLOCKING ----------------

// Reflect the persisted state when settings opens
window.api.on('blocking-enabled-state', ({ enabled }) => {
  blockingToggle.checked = enabled;
});

blockingToggle.addEventListener('change', () => {
  window.api.toggleBlocking(blockingToggle.checked);
});

window.api.on('settings-toggle-success', ({ enabled }) => {
  blockingToggle.checked = enabled;
});

window.api.on('settings-toggle-failed', ({ wrongPassword }) => {
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
      window.api.updateBlockedSites(blockedsites);
      renderDropdown();
    });

    siteElement.appendChild(deleteBtn);
    blockedContainer.appendChild(siteElement);
  });
}

inputContainer.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && inputContainer.value.trim()) {
    blockedsites.push(inputContainer.value.trim());
    window.api.updateBlockedSites(blockedsites);
    inputContainer.value = '';
    renderDropdown();
  }
});