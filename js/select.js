
const skins = [
  { shape: 'normal', color: 'black' },
  { shape: 'normal', color: 'browntabby' },
  { shape: 'normal', color: 'calico' },
  { shape: 'normal', color: 'cream' },
  { shape: 'normal', color: 'greytabby' },
  { shape: 'normal', color: 'orangetabby' },
  { shape: 'normal', color: 'russianblue' },
  { shape: 'normal', color: 'tonkinese' },
  { shape: 'normal', color: 'tuxedo' },
  { shape: 'normal', color: 'white' },
  { shape: 'fluffy', color: 'black' },
  { shape: 'fluffy', color: 'chinchilla' },
  { shape: 'fluffy', color: 'flamepoint' },
  { shape: 'fluffy', color: 'grey' },
  { shape: 'fluffy', color: 'mainecoon' },
  { shape: 'fluffy', color: 'orange' },
  { shape: 'fluffy', color: 'ragdoll' },
  { shape: 'fluffy', color: 'siberian' },
  { shape: 'fluffy', color: 'somali' },
  { shape: 'fluffy', color: 'white' },
];

let skinIndex = 0;

function updateSkinDisplay() {
  const skin = skins[skinIndex];
  document.getElementById('skin-name').textContent = `${skin.shape} ${skin.color}`;
  document.getElementById('skin-idx').textContent = `${skinIndex + 1} / ${skins.length}`;
}

document.getElementById('skin-prev').addEventListener('click', () => {
  skinIndex = (skinIndex - 1 + skins.length) % skins.length;
  updateSkinDisplay();
});

document.getElementById('skin-next').addEventListener('click', () => {
  skinIndex = (skinIndex + 1) % skins.length;
  updateSkinDisplay();
});

document.getElementById('skin-go').addEventListener('click', async () => {
  const skin = skins[skinIndex];
  ipcRenderer.send('set-cat-shape', skin.shape);
  ipcRenderer.send('set-cat-color', skin.color);

  catBody     = skin.shape;
  catColor    = skin.color;
  collarcolor = await ipcRenderer.invoke('get-collar-color');

  document.getElementById('skin-selector').style.display = 'none';
  initCat();
});

updateSkinDisplay();