const axios = require("axios");

const CEREBRAS_API_URL = "https://api.cerebras.ai/v1/chat/completions";
const API_KEYS = [
  "csk-mhndwmdwhktdp84nx6wmkyw6xy2cppf6dk5584mh5yxvk58j" // ✅ Check if this key is active
];

const OWNER_UIDS = [
  "100001749311229",
  "100002912465731",
  "100084744143874"
];

const OWNER_NAME = "prince";

function getRandomApiKey() {
  return API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
}

module.exports.config = {
  name: "prince",
  version: "3.5.0",
  hasPermssion: 0,
  credits: "Raj",
  description: "Nobita AI Final Fix with Debugging",
  commandCategory: "ai",
  usages: "",
  cooldowns: 1
};

const chatMemory = { history: {} };

async function replyAI(api, event) {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return;

  const isOwner = OWNER_UIDS.includes(senderID.toString());
  let messages = [];

  if (event.messageReply && event.messageReply.senderID == api.getCurrentUserID()) {
    messages = [
      { role: "assistant", content: event.messageReply.body || "" },
      { role: "user", content: body }
    ];
  } else {
    chatMemory.history[senderID] = chatMemory.history[senderID] || [];
    chatMemory.history[senderID].push({ role: "user", content: body });
    if (chatMemory.history[senderID].length > 15) chatMemory.history[senderID].shift();
    messages = chatMemory.history[senderID];
  }

  const PROMPT = isOwner
    ? `Tu Nobita hai. Prince/Owner: ${OWNER_NAME}. Respectful raho. 1 line me jawab do.`
    : `Tu Nobita hai. Prince: ${OWNER_NAME}. Sarcastic roast on light insults. 1 line only.`;

  try {
    const res = await axios.post(
      CEREBRAS_API_URL,
      {
        model: "llama3.1-8b", // ✅ 70b fail ho toh 8b try karein (stable hai)
        messages: [{ role: "system", content: PROMPT }, ...messages],
        temperature: 0.7,
        max_tokens: 100
      },
      {
        headers: {
          "Authorization": `Bearer ${getRandomApiKey()}`,
          "Content-Type": "application/json"
        },
        timeout: 15000 
      }
    );

    let reply = res.data?.choices?.[0]?.message?.content || "Hmm 😅";
    reply = reply.replace(/\n+/g, " ").trim().split(/[.!?]/)[0];

    if (!event.messageReply) {
      chatMemory.history[senderID].push({ role: "assistant", content: reply });
    }

    return api.sendMessage(reply, threadID, messageID);
  } catch (e) {
    // Ye logs Render console me check karna
    console.log("FULL ERROR:", e.response?.data || e.message);

    let errorNote = "Network slow hai 😌"; 
    
    if (e.response?.status === 401) errorNote = "Abe teri API KEY galat hai ya expire ho gayi! ❌";
    if (e.response?.status === 404) errorNote = "Cerebras ne model name change kar diya hai! 🔄";
    if (e.response?.status === 429) errorNote = "API Limit khatam! New key dalo. ⏳";
    if (e.message.includes("timeout")) errorNote = "Server response nahi de raha, thoda ruko. ⏳";

    return api.sendMessage(errorNote, threadID, messageID);
  }
}

module.exports.run = async function () {};

module.exports.handleEvent = async function ({ api, event }) {
  if (event.type !== "message" && event.type !== "message_reply") return;
  const body = event.body?.toLowerCase() || "";
  const isReplyToBot = event.messageReply && event.messageReply.senderID == api.getCurrentUserID();

  if (body.includes("bot") || body.includes("nobita") || isReplyToBot) {
    return replyAI(api, event);
  }
};
