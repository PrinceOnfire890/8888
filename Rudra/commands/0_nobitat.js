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
    ? `STRICT IDENTITY: Tera naam Nobita hai. Malik: ${OWNER_NAME}. Tu Prince nahi hai. BEHAVIOUR: Loyal aur respectful. 1-2 lines only.`
    : `STRICT IDENTITY: Tu sirf Nobita hai, Prince nahi. Boss/Prince sirf ${OWNER_NAME} hai.
       
       ADAPTIVE BEHAVIOUR:
       1. GENDER DETECTION: User ki baaton se guess kar ki wo ladki hai ya ladka.
       2. FLIRTING: Agar samne wali LADKI hai (ya ladkiyon ki tarah baat kar rahi hai), toh thodi thodi flirting kar, pyaari baatein kar, par limit me rehkar.
       3. TONE MIRRORING: Agar koi ladka gaali de, toh use gusse me jawab de. Agar koi tameez se baat kare, toh tameez se jawab de.
       4. TOPIC: User ki baat ka hi jawab dena, idhar udhar ki baatein mat karna.
       
       RULES: Hinglish only, 1-2 lines max. Shizuka ke baare me mat bolna, tu abhi singles ki tarah behave kar.`;

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
