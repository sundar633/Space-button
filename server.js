require('dotenv').config();
const express = require('express');
const http = require('http');
const fetch = require('node-fetch');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const COHERE_API_KEY = process.env.COHERE_API_KEY;

app.use(express.static('public'));
app.use(express.json());

// ✅ Cohere AI Answer API
app.post('/ask-ai', async (req, res) => {
    const { question } = req.body;
    try {
        const response = await fetch('https://api.cohere.ai/v1/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${COHERE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: question,
                model: 'command-r-plus',  // fastest and smart model
                temperature: 0.5,
                chat_history: []
            })
        });
        const data = await response.json();
        const answer = data.text || "No answer from Cohere";
        res.json({ answer });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ answer: "Error from Cohere" });
    }
});

// ✅ Socket.io (space key signal)
io.on('connection', socket => {
    console.log('Receiver connected');
    socket.on('space_pressed', () => io.emit('space_pressed'));
});

server.listen(3000, () => console.log('✅ Server running on port 3000'));
