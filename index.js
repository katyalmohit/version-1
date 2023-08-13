// Node server which will handle socket io connections
const io = require('socket.io')(8000,{
    cors:{
        origin: 'http://127.0.0.1:5500',
    }
});
function initializeChatbot(socket) {
    const botName = 'ChatBot';
    
    // Send a welcome message to the new user
    socket.emit('receive', {
        message: `Hello! Welcome to our chatroom. I am ${botName}, your friendly chatbot.`,
        name: botName,
    });

    // Provide information about your app
    setTimeout(() => {
        socket.emit('receive', {
            message: `You can start chatting with other users now. 
Some Salient features are:
1. Multi-person chat room.
2. Click on any sent message or recieved message to narrate the whole message.(Text-to-Speech)
3. Click on the microphone icon to start listening. Click on stop after you are finished and the text appears in the text area.(Speech-to-Text)
    ` ,
            name: botName,
        });
    }, 1000); // Delay the second message a bit
}
const users = {};

io.on('connection', socket =>{
    initializeChatbot(socket);
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{ 
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });

    // If someone leaves the chat, let others know 
    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });


})