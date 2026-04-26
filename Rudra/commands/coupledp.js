const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

// 🔒 Lock credits and powered by phrase
const lockedCredits = Object.freeze("Rudra");
const lockedTagline = Object.freeze("🖤 Powered by Rudra");

// Hook to detect if message is tampered
function verifyTagline(text) {
  if (!text.includes(lockedTagline)) {
    throw new Error("🚫 Unauthorized modification detected: 'Powered by Rudra' was removed or altered.");
  }
}

module.exports.config = {
  name: "pintrest",
  version: "2.0.0",
  hasPermssion: 0,
  get credits() {
    return lockedCredits;
  },
  set credits(_) {
    throw new Error("❌ Credits are locked and cannot be modified.");
  },
  description: "Fetch couple dp images from Pinterest API server",
  commandCategory: "fun",
  usages: "+coupledp your query - number",
  cooldowns: 3
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const q = args.join(" ");
    if (!q.includes("-")) {
      return api.sendMessage("⚠️ Usage: +coupledp your query - number\nExample: +coupledp mohit riya - 2", event.threadID);
    }

    const query = q.substring(0, q.indexOf("-")).trim();
    const count = parseInt(q.split("-").pop().trim()) || 1;

    const cachePath = path.join(__dirname, "cache");
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

    // ✅ Updated Render URL
    const url = `https://rudra-pintrest-server-wg55.onrender.com/dp?q=${encodeURIComponent(query)}&n=${count}`;
    const res = await axios.get(url);

    if (!res.data || res.data.status !== "success" || !res.data.data.length) {
      return api.sendMessage("❌ Couldn't fetch DPs. Try another keyword.", event.threadID);
    }

    const images = res.data.data;
    const attachments = [];

    for (let i = 0; i < images.length; i++) {
      const imgPath = path.join(cachePath, `dp${i}.jpg`);
      const imgBuffer = (await axios.get(images[i], { responseType: "arraybuffer" })).data;
      fs.writeFileSync(imgPath, imgBuffer);
      attachments.push(fs.createReadStream(imgPath));
    }

    // 🔒 Protected caption
    const caption = `📸 Here's your *${count}* stylish DP (${query})\n${lockedTagline}`;
    verifyTagline(caption); // validate before sending

    api.sendMessage({
      body: caption,
      attachment: attachments
    }, event.threadID, () => {
      for (let i = 0; i < images.length; i++) {
        const imgPath = path.join(cachePath, `dp${i}.jpg`);
        fs.unlinkSync(imgPath);
      }
    }, event.messageID);

  } catch (err) {
    console.error("[CoupleDP ERROR]", err.message);
    api.sendMessage("🚫 Something went wrong while fetching Couple DPs. Try again later.", event.threadID, event.messageID);
  }
};
