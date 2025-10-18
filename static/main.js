const socket = io();
const form = document.getElementById('chat-form');
const chatBox = document.getElementById('chat-box');
const nicknameInput = document.getElementById('nickname');
const messageInput = document.getElementById('message');

if (localStorage.getItem('nickname')) {
  nicknameInput.value = localStorage.getItem('nickname');
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const nickname = nicknameInput.value.trim();
  const message = messageInput.value.trim();
  if (!nickname || !message) return;

  localStorage.setItem('nickname', nickname);
  socket.emit('send_message', { nickname, message });
  messageInput.value = '';
});

socket.on('receive_message', function (data) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  const isMine = data.nickname === nicknameInput.value;
  messageDiv.classList.add(isMine ? 'my-message' : 'other-message');

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  messageDiv.innerHTML = `
    <strong>${data.nickname}</strong><br>
    ${data.message}
    <div class="timestamp">${time}</div>
  `;

  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
});