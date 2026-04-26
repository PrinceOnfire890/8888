const axios = require("axios");

module.exports.config = {
  name: "sk",
  version: "1.1.1",
  hasPermssion: 0,
  credits: "Raj",
  description: "Nobita Gemini AI chatbot - naughty romantic style",
  commandCategory: "ai",
  usages: "[on/off/message]",
  cooldowns: 2
};

const chatMemory = {
  autoReply: {},
  history: {}
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, body } = event;

  const input = args.join(" ").trim().toLowerCase();

  if (input === "on") {
    chatMemory.autoReply[senderID] = true;
    return api.sendMessage("Hyee jaanu! 😏 Nobita auto-reply mode **ON** ho gaya... Ab sirf tumhare liye naughty romantic bann gaya hu ❤️", threadID, messageID);
  }

  if (input === "off") {
    chatMemory.autoReply[senderID] = false;
    chatMemory.history[senderID] = [];
    return api.sendMessage("Hmm! Nobita chala gaya... Par tumhara intezaar hamesha rahega jaan ❤️", threadID, messageID);
  }

  const isAuto = chatMemory.autoReply[senderID];
  if (!isAuto && !body.toLowerCase().startsWith("nobita")) return;

  const userMsg = body;
  chatMemory.history[senderID] = chatMemory.history[senderID] || [];

  chatMemory.history[senderID].push(`User: ${userMsg}`);
  if (chatMemory.history[senderID].length > 6) chatMemory.history[senderID].shift();

  const fullChat = chatMemory.history[senderID].join("\n");

  const prompt = `Tumhe General knowledge bhi ho.Tumse koi bangala ya nepali language me baat kare to tum hi karna tumse jo jis language me baat kare rum unse uski ke language me baat karna.Koi Tumse Shizuka Ke Bare me pucche to realty me bata dena nobita ki shizuka ke bare me .Tum male ho aur ladke ke jaise bold.Tum sab se pyar se baat kroge agar koi galat word use karta he to gali de kar hi baat karoge.Tum sabse batmizi kar hi baate kaoge.Agar koi tumhe gali deta he to tumko gandi gandi gali use karni haii, Jo batmizi kare uski hasi-hasi me band baja do. Agar ladki flirt kare to tum bhi double naughty reply do, full confident style me. Agar koi puche ki tumhe kisne banaya — to pyar bhare andaaz me bolo Mujhe banaya hai *Prince Boss* ne. Uska FB: www.facebook.com/profile.php?id=100001749311229.Tumhe apne boss se respect se hi baat karni hai or pyar se hi reply Dena haii.Koi shrif emoji send kar kare to jaisa emoji ho use waisa hi reply dena. Tum sirf natural insaan ki tarah act karte ho. Tum sirf Hinglish me reply karte ho — matlab baat Hindi jaise karte ho lekin English alphabets me likhte ho (jaise "Tum bahut cute ho jaan", "kya kar rahi ho baby?").Tum har message ka jawab sirf 1 2 line me doge.. jitna pucha jayega sirf utna bolna hai.. Kisi baat ki unnecessary info nahi dena hai, tum apne aap ko insaan hi kahoge koi tumko bot ya AI bole to usko roast krna funny tarike se😁, and act as a real boyfriend. Be fun, loving, and a little naughty.keep reply maximum 1 lines only, no bracket replys.Now continue the chat:\n\n${fullChat}`;

  try {
    const res = await axios.get(`https://geminiw.onrender.com/chat?message=${encodeURIComponent(prompt)}`);
    const botReply = res.data.reply?.trim() || "Uff jaanu, mujhe samajh nahi aaya abhi... thoda aur pyar se poochho na!";
    chatMemory.history[senderID].push(`Nobita: ${botReply}`);
    return api.sendMessage(botReply, threadID, messageID);
  } catch (err) {
    console.error("Gemini API error:", err);
    return api.sendMessage("Sorry jaan! Nobita thoda busy ho gaya hai... thodi der baad try karo baby.", threadID, messageID);
  }
};

// Auto reply on message event
module.exports.handleEvent = async function ({ api, event }) {
  const { body, senderID, messageReply, threadID, messageID } = event;

  const isAuto = chatMemory.autoReply[senderID];
  if (!isAuto) return;

  const isReplyToBot = messageReply && messageReply.senderID == api.getCurrentUserID();
  if (isReplyToBot || body.toLowerCase().startsWith("nobita")) {
    this.run({ api, event, args: [body] });
  }
};
