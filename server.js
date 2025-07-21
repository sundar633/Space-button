const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

app.use(express.static('public'));

io.on('connection', socket => {
    console.log('Receiver Connected');
});

app.get('/pressed', (req, res) => {
    console.log('Space pressed signal received!');
    io.emit('space_pressed');
    res.send('OK');
});

http.listen(3000, () => console.log('Server running on port 3000'));
