const invite = document.querySelector('.invite-btn');
const inviteContent = document.querySelector('.invite-content');
const createInvite = document.querySelector('.create-invite');
const enterCode = document.querySelector('.enter-code');

// ---------------- INVITE TOGGLE ----------------

invite.addEventListener('click', () => {
  inviteContent.style.display = inviteContent.style.display === 'flex' ? 'none' : 'flex';
});

// ---------------- CREATE ROOM ----------------

createInvite.addEventListener('click', async () => {
  const userName = await window.api.getPlayerName() || 'Anonymous';
  console.log('create room clicked');
  window.api.openRoom({
    name: userName,
    creator: true,
    code: ''
  });
});

// ---------------- JOIN ROOM ----------------

enterCode.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter' && enterCode.value.trim()) {
    const userName = await window.api.getPlayerName() || 'Anonymous';
    window.api.openRoom({
      name: userName,
      creator: false,
      code: enterCode.value.trim().toUpperCase()
    });
  }
});