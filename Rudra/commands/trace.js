module.exports = {
  config: {
    name: "trace",
    version: "1.0",
    author: "Rudra",
    cooldowns: 5,
    role: 0,
    shortDescription: {
      en: "Generate a tracking link for mentioned user"
    },
    category: "tools"
  },

  onStart: async function ({ api, event, args }) {
    const mention = Object.keys(event.mentions)[0];
    if (!mention) return api.sendMessage("❌ Please mention someone to trace.", event.threadID, event.messageID);

    const name = event.mentions[mention];
    const link = `https://tracker-rudra.onrender.com/?uid=${mention}`;
    const time = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    api.sendMessage({
      body: `🕵️‍♂️ 𝑹𝒖𝒅𝒓𝒂 𝑻𝒓𝒂𝒄𝒌 𝑳𝒊𝒏𝒌\n\n👤 Target: ${name}\n🔗 Link: ${link}\n🕒 Time: ${time}`,
      mentions: [{ id: mention, tag: name }]
    }, event.threadID, event.messageID);
  }
};
