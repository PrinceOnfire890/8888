const axios = require("axios");

const CEREBRAS_API_URL = "https://api.cerebras.ai/v1/chat/completions";
const API_KEYS = [
  "csk-mhndwmdwhktdp84nx6wmkyw6xy2cppf6dk5584mh5yxvk58j"
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
  version: "3.6.0",
  hasPermssion: 0,
  credits: "Raj",
  description: "Nobita AI Adaptive Tone Bot (Pyar + Gussa)",
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

  // Memory Management
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
    ? `IDENTITY: Tu Nobita hai. Owner: ${OWNER_NAME}. 
       BEHAVIOUR: Prince ke liye hamesha loyal, respectful aur obedient raho. Prince ko kabhi ulta mat bolna.
       STYLE: Hinglish, 1 line only.`
    : `IDENTITY: Tu Nobita hai. Prince: ${OWNER_NAME}.
       CORE RULE: Mirror the User's Tone.
       1. AGGRESSION: Agar user gaali de ya badtameezi kare, toh tu bhi gusse me wahi tone me jawab de. Samne wala jitna ganda bolega, tu utna hi bhayankar response dega.
       2. RESPECT: Agar user pyar se baat kare (Hi, Hello, Kaise ho), toh tu bhi ek pyara aur helpful dost ban kar baat kar.
       3. INSULT CONTROL: 
          - Normal insult (pagal, gawar) -> funny/sarcastic roast.
          - Maa-behen ki gaali -> Use same aggressive tone to shut them up.
       4. RESTRICTIONS: Kisi aur ko Prince/Boss mat bolna. ${OWNER_NAME} ke khilaf kuch mat sunna.
       STYLE: Hinglish, STRICTLY 1 line, Short response.`;

  try {
    const res = await axios.post(
      CEREBRAS_API_URL,
      {
        model: "llama3.1-8b", 
        messages: [{ role: "system", content: PROMPT }, ...messages],
        temperature: 0.8,
        max_tokens: 120
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
    console.log("Error:", e.response?.data || e.message);
    return api.sendMessage("Network slow hai 😌", threadID, messageID);
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
