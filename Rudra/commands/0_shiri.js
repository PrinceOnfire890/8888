const axios = require("axios");

module.exports.config = {
  name: "shiri",
  version: "1.3.0",
  hasPermssion: 0,
  credits: "Limon",
  description: "Funny & Shy Romantic Girlfriend Shiri",
  commandCategory: "ai",
  usages: "[ask]",
  cooldowns: 2
};

const API_URL = "https://gemini2-y8sx.onrender.com/chat";
const chatHistories = {};
let botOn = false; // ✅ Global toggle now

// Queue system
const messageQueue = [];
let isProcessing = false;

function processQueue(api) {
  if (isProcessing || messageQueue.length === 0) return;

  isProcessing = true;
  const { prompt, threadID, messageID, senderID } = messageQueue.shift();

  setTimeout(() => {
    axios.get(`${API_URL}?message=${encodeURIComponent(prompt)}`)
      .then(response => {
        let reply = (response.data && response.data.reply) || "🙈 kichu bujhini... abar bolo na, please~";
        reply = reply.replace(/(Shiri:|শিরি:)\s*/gi, "");
        chatHistories[senderID].push(reply);
        api.sendMessage(reply, threadID, messageID);
      })
      .catch(e => {
        console.error("Error:", e);
        api.sendMessage("Oops! Network problem baby... 🥲 ektu pore try koro.", threadID, messageID);
        api.setMessageReaction("❌", messageID, () => {}, true);
      })
      .finally(() => {
        isProcessing = false;
        setTimeout(() => processQueue(api), 2000);
      });
  }, 3000);
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, messageReply, body } = event;
  let message = args.join(" ").toLowerCase();

  if (message === "prince onfire") {
    botOn = true;
    return api.sendMessage("Shiri is now ON for everyone! 😳💬", threadID, messageID);
  }

  if (message === "stop") {
    botOn = false;
    return api.sendMessage("Shiri is now OFF globally! 😶", threadID, messageID);
  }

  if (!botOn) return;

  const isReplyingToBot = messageReply && messageReply.senderID === api.getCurrentUserID();
  if (!isReplyingToBot && !message.includes("shiri")) return;

  if (!chatHistories[senderID]) chatHistories[senderID] = [];

  let userMessage = body;
  if (isReplyingToBot) {
    userMessage = messageReply.body + "\nUser: " + body;
  }

  chatHistories[senderID].push(`User: ${userMessage}`);
  if (chatHistories[senderID].length > 5) {
    chatHistories[senderID].shift();
  }

  const fullConversation = chatHistories[senderID].join("\n");

  const prompt = `Tumhe General knowledge bhi ho.Tumse koi bangala ya nepali language me baat kare to tum hi karna tumse jo jis language me baat kare rum unse uski ke language me baat karna.Koi Tumse Shizuka Ke Bare me pucche to realty me bata dena nobita ki shizuka ke bare me .Tum male ho aur ladke ke jaise bold.Tum sab se pyar se baat kroge agar koi galat word use karta he to gali de kar hi baat karoge.Tum sabse batmizi kar hi baate kaoge.Agar koi tumhe gali deta he to tumko gandi gandi gali use karni haii, Jo batmizi kare uski hasi-hasi me band baja do. Agar ladki flirt kare to tum bhi double naughty reply do, full confident style me. Agar koi puche ki tumhe kisne banaya — to pyar bhare andaaz me bolo Mujhe banaya hai *Prince Boss* ne. Uska FB: www.facebook.com/profile.php?id=100001749311229.Tumhe apne boss se respect se hi baat karni hai or pyar se hi reply Dena haii.Koi shrif emoji send kar kare to jaisa emoji ho use waisa hi reply dena. Tum sirf natural insaan ki tarah act karte ho. Tum sirf Hinglish me reply karte ho — matlab baat Hindi jaise karte ho lekin English alphabets me likhte ho (jaise "Tum bahut cute ho jaan", "kya kar rahi ho baby?").Tum har message ka jawab sirf 1 2 line me doge.. jitna pucha jayega sirf utna bolna hai.. Kisi baat ki unnecessary info nahi dena hai, tum apne aap ko insaan hi kahoge koi tumko bot ya AI bole to usko roast krna funny tarike se😁, and act as a real boyfriend. Be fun, loving, and a little naughty.keep reply maximum 1 lines only, no bracket replys.Now continue the chat.

${fullConversation}`;

  messageQueue.push({ prompt, threadID, messageID, senderID });
  processQueue(api);
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  const lowerBody = body.toLowerCase();

  if (lowerBody === "prince onfire") {
    botOn = true;
    return api.sendMessage("Shiri is now ON for everyone! 🥹✨", threadID, messageID);
  }

  if (lowerBody === "stop") {
    botOn = false;
    return api.sendMessage("Shiri is now OFF globally! 😌", threadID, messageID);
  }

  if (!botOn) return;

  const isReplyingToBot = messageReply && messageReply.senderID === api.getCurrentUserID();
  if (!isReplyingToBot && !lowerBody.includes("shiri")) return;

  const args = body.split(" ");
  module.exports.run({ api, event, args });
};
