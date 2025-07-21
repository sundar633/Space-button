const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*" } });
const { Configuration, OpenAIApi } = require("openai");

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = "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";

const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY }));

app.use(express.static('public'));
app.use(express.json());

// ✅ AI Answer Route
app.post('/ask-ai', async (req, res) => {
    const { question } = req.body;
    try {
        const completion = await openai.createChatCompletion({
            model: "gpt-4o",
            messages: [{ role: "user", content: question }]
        });
        const answer = completion.data.choices[0].message.content;
        res.json({ answer });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ answer: "Error from AI." });
    }
});

// ✅ WebSocket Broadcast
io.on('connection', (socket) => {
    console.log("✅ Receiver connected");
    socket.on('space_pressed', () => io.emit('space_pressed'));
});

http.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
