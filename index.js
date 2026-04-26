const { spawn } = require("child_process");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const express = require("express");

const logger = require("./utils/log");

const app = express();
const port = process.env.PORT || 8080;

// Serve index.html or fallback message
app.get('/', function (req, res) {
    const filePath = path.join(__dirname, 'index.html');
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.send('<h1>🌐 Dashboard Online - No index.html Found</h1>');
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).send('❌ 404: Page not found');
});

// Start the server
app.listen(port, () => {
    console.log(`✅ Web server started on port ${port}`);
    logger(`🌐 Server is running on port ${port}...`, "[ Starting ]");
}).on('error', (err) => {
    logger(`❌ Server error: ${err.message}`, "[ Error ]");
});

// Restart logic
global.countRestart = global.countRestart || 0;

function startBot(message) {
    if (message) logger(message, "[ Starting ]");

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "rudra.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit !== 0 && global.countRestart < 5) {
            global.countRestart++;
            logger(`🔁 Bot exited with code ${codeExit}. Restarting... (${global.countRestart}/5)`, "[ Restarting ]");
            startBot();
        } else {
            logger(`🛑 Bot stopped after ${global.countRestart} restarts.`, "[ Stopped ]");
        }
    });

    child.on("error", (error) => {
        logger(`❌ An error occurred: ${JSON.stringify(error)}`, "[ Error ]");
    });
}

// GitHub Update check
axios.get("https://raw.githubusercontent.com/priyanshu192/bot/main/package.json")
    .then((res) => {
        logger(`📦 ${res.data.name}`, "[ NAME ]");
        logger(`📌 Version: ${res.data.version}`, "[ VERSION ]");
        logger(`📝 ${res.data.description}`, "[ DESCRIPTION ]");
    })
    .catch((err) => {
        logger(`⚠️ Failed to fetch update info: ${err.message}`, "[ Update Error ]");
    });

// Start the bot
startBot();
