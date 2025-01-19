const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from the URL query parameters
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

// Initialize Socket.IO
const socket = io();

// Join chat room
socket.emit('joinRoom', { username, room });

// Listen for room and user updates
socket.on('roomUsers', ({ room, users }) => {
    updateRoomName(room);
    updateUserList(users);
});

// Listen for messages from the server
socket.on('message', (message) => {
    console.log(message);
    appendMessage(message);

    // Auto-scroll to the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit handler
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get the input message
    const msg = e.target.elements.msg.value.trim();

    if (msg) {
        // Emit the message to the server
        socket.emit('chatMessage', msg);

        // Clear the input field and focus it for the next message
        e.target.elements.msg.value = '';
        e.target.elements.msg.focus();
    }
});

// Append a message to the chat messages container
function appendMessage({ username, text, time }) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${username} <span>${time}</span></p>
        <p class="text">${text}</p>
    `;
    chatMessages.appendChild(div);
}

// Update the room name in the DOM
function updateRoomName(room) {
    roomName.textContent = room;
}

// Update the user list in the DOM
function updateUserList(users) {
    userList.innerHTML = users
        .map((user) => <li>${user.username}</li>)
        .join('');
}


// Listen for chatHistory event from the server
socket.on('chatHistory', (messages) => {
    messages.forEach(message => {
        outputMessage(message); // Use your existing function to display messages
    });
});

// Function to display messages in the chat
function outputMessage(message) {
    const chatMessages = document.querySelector('.chat-messages');
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">${message.text}</p>
    `;
    chatMessages.appendChild(div);

    // Scroll to the bottom of the chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
}