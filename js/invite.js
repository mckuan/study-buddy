const invite = document.querySelector('.invite-btn');
const inviteContent = document.querySelector('.invite-content');

// ---------------- INVITE ----------------

invite.addEventListener('click', () => {
  inviteContent.style.display =
    inviteContent.style.display === 'flex' ? 'none' : 'flex';
});