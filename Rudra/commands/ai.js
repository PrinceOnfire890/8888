const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "ai",
  version: "1.0",
  hasPermssion: 0,
  credits: "Converted by Rudra",
  description: "Ask AI with NSFW, image/audio, models, assistants",
  commandCategory: "ai",
  usages: "[your question]",
  cooldowns: 2,
};

const assistantList = [
  "lover", "helpful", "friendly", "toxic", "bisaya", "horny", "tagalog", "makima", "godmode", "default"
];

const models = {
  1: "llama",
  2: "gemini"
};

const globalConfigFile = __dirname + "/ai-config.json";

function loadGlobalConfig() {
  if (!fs.existsSync(globalConfigFile)) return { nsfw: false, model: "llama" };
  return JSON.parse(fs.readFileSync(globalConfigFile));
}

function saveGlobalConfig(config) {
  fs.writeFileSync(globalConfigFile, JSON.stringify(config, null, 2));
}

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID, type, messageReply } = event;
  const config = loadGlobalConfig();

  const prefix = global.config.PREFIX || "/";
  const name = (await api.getUserInfo(senderID))[senderID].name;

  if (!args[0]) {
    return api.sendMessage(`Hi ${name}!\nUse:\n• ${prefix}ai set <assistant>\n• ${prefix}ai model <1/2>\n• ${prefix}ai nsfw on/off\nThen ask like:\n• ${prefix}ai What is love?`, threadID, messageID);
  }

  const cmd = args[0].toLowerCase();

  if (cmd === "set") {
    const assistant = args[1]?.toLowerCase();
    if (!assistantList.includes(assistant)) {
      return api.sendMessage(`Invalid assistant.\nAvailable:\n${assistantList.join(", ")}`, threadID, messageID);
    }
    config.assistant = assistant;
    saveGlobalConfig(config);
    return api.sendMessage(`✅ Assistant set to: ${assistant}`, threadID, messageID);
  }

  if (cmd === "model") {
    const selected = models[args[1]];
    if (!selected) {
      return api.sendMessage(`Invalid model. Use:\n1. llama\n2. gemini`, threadID, messageID);
    }
    config.model = selected;
    saveGlobalConfig(config);
    return api.sendMessage(`✅ Model changed to: ${selected}`, threadID, messageID);
  }

  if (cmd === "nsfw") {
    if (args[1]?.toLowerCase() === "on") {
      config.nsfw = true;
      saveGlobalConfig(config);
      return api.sendMessage(`🔞 NSFW Enabled.`, threadID, messageID);
    }
    if (args[1]?.toLowerCase() === "off") {
      config.nsfw = false;
      saveGlobalConfig(config);
      return api.sendMessage(`🚫 NSFW Disabled.`, threadID, messageID);
    }
    return api.sendMessage(`Use:\n${prefix}ai nsfw on\nor\n${prefix}ai nsfw off`, threadID, messageID);
  }

  // Continue AI Chat
  const prompt = args.join(" ");
  let mediaURL = null;

  if (messageReply?.attachments?.[0]) {
    const att = messageReply.attachments[0];
    if (att.type === "photo") mediaURL = { link: att.url, type: "image" };
    else if (att.type === "audio") mediaURL = { link: att.url, type: "mp3" };
  }

  const response = await queryAI({
    prompt,
    id: senderID,
    name,
    system: config.assistant || "helpful",
    gender: "neutral",
    model: config.model || "llama",
    nsfw: config.nsfw,
    url: mediaURL
  });

  const msg = {
    body: response.result
  };

  if (response.media) {
    msg.attachment = await global.utils.getStreamFromURL(response.media);
  }

  return api.sendMessage(msg, threadID, messageID);
};

// AI Function (from your original)
async function queryAI({ prompt, id, name, system, gender, model, nsfw, url = null }) {
  const g4o = async (p, m = "gemma2-9b-it") =>
    axios.post(
      atob(String.fromCharCode(...atob((await axios.get(atob("aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2p1bnpkZXZvZmZpY2lhbC90ZXN0L3JlZnMvaGVhZHMvbWFpbi90ZXN0LnR4dA=="))).data).split(" ").map(Number))),
      {
        id,
        prompt: p,
        name,
        model,
        system,
        customSystem: [
          { default: "You are helpful assistant" },
          { makima: "You are a friendly assistant, your name is makima" }
        ],
        gender,
        nsfw,
        url: url ? url : undefined,
        config: [{
          gemini: {
            apikey: "AIzaSyAqigdIL9j61bP-KfZ1iz6tI9Q5Gx2Ex_o",
            model: "gemini-1.5-flash"
          },
          llama: { model: m }
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test'
        }
      });

  try {
    let res = await g4o(prompt);
    if (["i cannot", "i can't"].some(x => res.data.result.toLowerCase().startsWith(x))) {
      await g4o("clear");
      res = await g4o(prompt, "llama-3.1-70b-versatile");
    }
    return res.data;
  } catch {
    try {
      return (await g4o(prompt, "llama-3.1-70b-versatile")).data;
    } catch (err) {
      const e = err.response?.data;
      const errorMessage = typeof e === 'string' ? e : JSON.stringify(e);
      return errorMessage.includes("Payload Too Large") ? { result: "❌ Text too long." } :
        errorMessage.includes("Service Suspended") ? { result: "⚠️ API suspended. Dev will update soon." } :
          { result: e?.error || e || err.message };
    }
  }
}
