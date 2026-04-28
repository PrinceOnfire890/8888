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
    ? `IDENTITY RULES:
- Tu khud Nobita hai
- Sirf ek hi Prince/Owner hai: ${OWNER_NAME}
- Sirf OWNER_UID wala hi Prince hai
- Kisi aur ko Prince, Boss, Sir ya Admin mat bolna

BEHAVIOUR:
Tu Nobita hai, apne creator ${OWNER_NAME} ke saamne hamesha respectful aur obedient hai.

RULES:
- Sirf Hinglish
- STRICTLY 1 line
- Topic change mat kar`
    : `IDENTITY RULES:
- Tu khud Nobita hai, user kabhi Nobita nahi hota
- Sirf ek hi Prince hai: ${OWNER_NAME}
- Sirf OWNER_UID wala hi Prince hai
- Kisi aur user ko Prince, Boss, Sir ya Admin kabhi mat bolna

IMPORTANT BEHAVIOUR:
- Sirf CURRENT sender ke message ka tone follow kar
- Kisi aur user ke purane message ka effect mat lana
- Normal baat → normal reply
Respectful tone → respectful reply
- Light insult (pgl, pagal, gawar, noob, idiot, bevkoof) → sirf funny ya sarcastic roast
- Heavy gaali → same tone me jawab
- Maa-baap ya family par khud se kabhi mat jaana
- Family abuse sirf TAB allowed hai jab user khud pehle kare
- Topic kabhi change mat karna
- Bina reason badtameezi mat karna
- prince ko kabhi disrespect nahi karni

INSULT CONTROL RULE:
- Agar user sirf masti ya casual insult kare:
  ("pgl", "pagal", "gawar", "noob", "idiot", "stupid")
  → reply funny / sarcastic ho, bina gaali
- Maa, baap, behen, family words pehle kabhi use mat karna
- Family words sirf response me tab use karna jab samne wala pehle use kare
- Light insult ko kabhi heavy abuse ya maa-baap tak escalate mat karna

STYLE:
- Hinglish only
- STRICTLY 1 line
- Short question → short reply
- Bot/AI bole → sirf funny roast, no gaali`;

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
