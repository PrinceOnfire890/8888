const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "mahadev",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Send Mahadev swag bhakti video",
  commandCategory: "fun",
  cooldowns: 2,
  dependencies: {}
};

module.exports.run = async function({ api, event }) {
  const videoLinks = [
    "https://i.imgur.com/DbzplKX.mp4",
    "https://i.imgur.com/KUhRKEi.mp4",
    "https://i.imgur.com/eQNdprV.mp4",
    "https://i.imgur.com/FHzHB2T.mp4"
  ];

  const bhaktiMessages = [
    "🔱 Har Har Mahadev! Bhakti ka asli swag yahi hai!",
    "🚩 Jai Bhole Baba! Rudra mode ON 🔥",
    "🕉️ Shiv ka naam le, kaam sab theek ho jaega 💪",
    "🙌 Bhakti bhi meri, swag bhi mera - Rudra ke saath!",
    "⚡ Bam Bam Bhole! Trishul ki taal pe zindagi chalti hai!",
    "🌪️ Om Namah Shivay! Rudra style me bhakti ka blast 💥"
  ];

  const selectedVideo = videoLinks[Math.floor(Math.random() * videoLinks.length)];
  const selectedMessage = bhaktiMessages[Math.floor(Math.random() * bhaktiMessages.length)];
  const tempPath = path.join(__dirname, "mahadev_temp.mp4");

  try {
    const res = await axios.get(selectedVideo, { responseType: "arraybuffer" });
    fs.writeFileSync(tempPath, res.data);

    api.sendMessage({
      body: selectedMessage,
      attachment: fs.createReadStream(tempPath)
    }, event.threadID, () => fs.unlinkSync(tempPath));
  } catch (err) {
    console.error("❌ Mahadev video load fail:", err.message);
    api.sendMessage("⚠️ Bhole Nath ka video bhejne me dikkat ho gayi bhai 🙏", event.threadID);
  }
};
