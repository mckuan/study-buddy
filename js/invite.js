const invite = document.querySelector('.invite-btn');
const inviteContent = document.querySelector('.invite-content');
const createInvite = document.querySelector('.create-invite');
const enterCode = document.querySelector('.enter-code');

let userName = localStorage.getItem('userName') || 'User';
localStorage.setItem('userName', userName);

// ---------------- INVITE TOGGLE ----------------

invite.addEventListener('click', () => {
  inviteContent.style.display = inviteContent.style.display === 'flex' ? 'none' : 'flex';
});

// ---------------- CREATE ROOM ----------------

createInvite.addEventListener('click', () => {
  ipcRenderer.send('open-room', {
    name: userName,
    creator: true,
    code: ''
  });
});

// ---------------- JOIN ROOM ----------------

enterCode.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && enterCode.value.trim()) {
    ipcRenderer.send('open-room', {
      name: userName,
      creator: false,
      code: enterCode.value.trim().toUpperCase()
    });
  }
});