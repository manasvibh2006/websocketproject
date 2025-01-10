const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName =  document.getElementById('room-name');
const userList =  document.getElementById('users');
//get username from url
const {username, room } = Qs.parse(location.search,{
    ignoreQueryPrefix: true
});


const socket = io(); // Initialize Socket.IO

//join room
socket.emit('joinRoom', { username, room});

//get room and users
socket.on('roomUsers',({room , users})=> {
    outputRoomName(room);
    outputUsersName(users);
});



// Listen for messages from the server
socket.on('message', (message) => {
    console.log(message);
    outputMessage(message);
   

//scroll down
chatMessages.scrollTop = chatMessages.scrollHeight;
});
// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value; // Fixed typo in "elements"

    //Emit message to server
   socket.emit('chatMessage',msg);

   //Clear input
   e.target.elements.msg.value='';
   e.target.elements.msg.focus();


    
});
//output message to DOM
function outputMessage(message) {
   const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta"> ${message.username}<span>${message.time}</span></p>
        <p class="text">${message.text}</p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

//add room name to dom
function outputRoomName(room){
    roomName.innerText = room;
}
//add users to dom
function outputUsersName(users){
    userList.innerHTML =
    `${users.map(user => `<li>${user.username}</li>`).join('')
    }`;
}