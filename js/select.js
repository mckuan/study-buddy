const skins = [
  // { shape: 'normal', color: 'black' },
  { shape: 'normal', color: 'browntabby' },
  // { shape: 'normal', color: 'calico' },
  // { shape: 'normal', color: 'cream' },
  // { shape: 'normal', color: 'greytabby' },
  // { shape: 'normal', color: 'orangetabby' },
  // { shape: 'normal', color: 'russianblue' },
  // { shape: 'normal', color: 'tonkinese' },
  // { shape: 'normal', color: 'tuxedo' },
  { shape: 'normal', color: 'white' },
];

const collarColors = [
  '#e07b72','#e8a89c','#e8b49a','#f2d5c8','#f0e4ce','#f0dfa0','#f0d060','#e8c84a',
  '#7ecdc8','#8e9fa8','#8faab4','#a8c4dc','#7896b0','#a0a878','#d8dce0','#c0a030',
  '#d8eef4','#c4dce0','#b0d4cc','#4aada8','#3a9e98','#b8c4c4','#d0d4dc','#c8d0e8',
  '#2c3e58','#4a5668','#6a7888','#d06870','#c46878','#d08898','#e8a8b8','#c8b0cc',
  '#8b2a2a','#a03830','#c06050','#d88060','#e09870','#e8b090','#f0c8a8','#f8dcc0',
  '#9a7030','#a89040','#c8b840','#8a9870','#506840','#789050','#90a860','#a8bc88',
  '#3a1010','#5a2818','#7a4030','#8b3818','#9a5028','#b06838','#c08050','#c89068',
];

const PAGE_SIZE = 8;
const totalPages = Math.ceil(collarColors.length / PAGE_SIZE);
const collarE = document.querySelector('.collarE');
 
let skinIndex = 0;
let collarPage = 0;
let selectedCollar = collarColors[0];
 
function updateSkinDisplay() {
  const skin = skins[skinIndex];
  document.getElementById('skin-name').src = `assets/${skin.shape}/${skin.color}/photo.png`;
  document.getElementById('skin-name').alt = `${skin.shape} ${skin.color}`;
  document.getElementById('skin-idx').textContent = `${skinIndex + 1} / ${skins.length}`;
}
 
function updateCollarDisplay() {
  const container = document.getElementById('collar-swatches');
  container.innerHTML = '';
  const start = collarPage * PAGE_SIZE;
  const slice = collarColors.slice(start, start + PAGE_SIZE);
  slice.forEach((color) => {
    const btn = document.createElement('button');
    btn.className = 'collar-swatch' + (color === selectedCollar ? ' selected' : '');
    btn.style.background = color;
    btn.addEventListener('click', () => {
      selectedCollar = color;
      updateCollarDisplay();
      collarE.style.background = selectedCollar;
    });
    container.appendChild(btn);
  });
  document.getElementById('collar-page-idx').textContent = `${collarPage + 1} / ${totalPages}`;
}
 
document.getElementById('skin-prev').addEventListener('click', () => {
  skinIndex = (skinIndex - 1 + skins.length) % skins.length;
  updateSkinDisplay();
});
document.getElementById('skin-next').addEventListener('click', () => {
  skinIndex = (skinIndex + 1) % skins.length;
  updateSkinDisplay();
});
 
document.getElementById('collar-prev').addEventListener('click', () => {
  collarPage = (collarPage - 1 + totalPages) % totalPages;
  updateCollarDisplay();
});
document.getElementById('collar-next').addEventListener('click', () => {
  collarPage = (collarPage + 1) % totalPages;
  updateCollarDisplay();
});
 
document.getElementById('skin-go').addEventListener('click', async () => {
  const skin = skins[skinIndex];
  const name = document.getElementById('player-name').value.trim();

  if (!name) {
    const welcome = document.querySelector('.select-welcome h2');
    welcome.textContent = 'please enter a name';
    welcome.style.color = '#c0392b';
    return;
  }

  ipcRenderer.send('set-cat-shape', skin.shape);
  ipcRenderer.send('set-cat-color', skin.color);
  ipcRenderer.send('set-collar-color', selectedCollar);
  ipcRenderer.send('set-player-name', name);

  catBody     = skin.shape;
  catColor    = skin.color;
  collarcolor = selectedCollar;

  document.getElementById('skin-selector').style.display = 'none';
  initCat();
});
updateSkinDisplay();
updateCollarDisplay();
 