const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeaves, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

const botName = 'ChatCord Bot';

// In-memory store for chat messages by room
const chatHistory = {};

io.on("connection", (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // Send chat history to the user
        if (chatHistory[room]) {
            socket.emit('chatHistory', chatHistory[room]);
        } else {
            chatHistory[room] = []; // Initialize if room doesn't exist
        }

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Welcome to ChatCord!'));

        // Broadcast when a user connects
        socket.broadcast
            .to(user.room)
            .emit('message', formatMessage(botName, `${user.username} has joined the chat`));
    });

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        const message = formatMessage(user.username, msg);

        // Save message to chat history
        chatHistory[user.room].push(message);

        io.to(user.room).emit('message', message);
    });

    // Runs when a client disconnects
    socket.on("disconnect", () => {
        const user = userLeaves(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



