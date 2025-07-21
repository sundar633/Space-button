const express = require('express');
const app = express();
const fetch = require('node-fetch');
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

// ✅ Serve static files (receiver.html)
app.use(express.static('public'));
app.use(express.json());

// ✅ POST API: Send text to Gemini and get answer
app.post('/ask-ai', async (req, res) => {
    const question = req.body.question;
    const apiKey = "AIzaSyBZ4X3hDoNVJe-E07iFQSc8zj3eIiZCWYA";

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "contents": [{ "parts": [{ "text": question }] }]
            })
        });

        const data = await response.json();
        const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No answer from Gemini.";
        res.json({ answer });
    } catch (e) {
        console.error(e);
        res.status(500).json({ answer: "Error fetching answer from Gemini." });
    }
});

// ✅ Socket.io for space_pressed event
io.on('connection', (socket) => {
    console.log('✅ Receiver connected');
    socket.on('space_pressed', () => {
        io.emit('space_pressed');
    });
});

http.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
