const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

module.exports.config = {
  name: "moto",
  version: "5.2.0",
  hasPermission: 2,
  credits: "M Talha",
  description: "Pathan boy AI Moto with memory and UID recognition",
  commandCategory: "AI",
  usages: "moto on / moto off / moto status",
  cooldowns: 3
};

let motoActive = false;
const memoryBase = path.join(__dirname, "memory");

function ensureUserFile(groupID, userID, groupName, userName) {
  const groupFolder = path.join(memoryBase, groupID);
  fs.ensureDirSync(groupFolder);
  const filePath = path.join(groupFolder, `${userID}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeJsonSync(filePath, {
      name: userName,
      tone: "normal",
      history: [],
      known: false,
      group: groupName
    }, { spaces: 2 });
  }
  return filePath;
}

function loadUserData(groupID, userID) {
  const filePath = path.join(memoryBase, groupID, `${userID}.json`);
  return fs.existsSync(filePath) ? fs.readJsonSync(filePath) : null;
}

function saveUserData(groupID, userID, data) {
  const filePath = path.join(memoryBase, groupID, `${userID}.json`);
  fs.writeJsonSync(filePath, data, { spaces: 2 });
}

function getUserGroupRecords(uid) {
  const folders = fs.readdirSync(memoryBase);
  const results = [];
  for (const folder of folders) {
    const file = path.join(memoryBase, folder, `${uid}.json`);
    if (fs.existsSync(file)) {
      const data = fs.readJsonSync(file);
      results.push({ groupID: folder, groupName: data.group || "Unknown Group", name: data.name });
    }
  }
  return results;
}

function getLahoreInfo() {
  const time = moment().tz("Asia/Karachi");
  const hour = time.hour();
  let partOfDay = "raat";
  if (hour >= 5 && hour < 12) partOfDay = "subah";
  else if (hour >= 12 && hour < 17) partOfDay = "dupehar";
  else if (hour >= 17 && hour < 21) partOfDay = "shaam";
  return {
    time: time.format("h:mm A"),
    day: time.format("dddd"),
    date: time.format("MMMM Do YYYY"),
    partOfDay
  };
}

function detectTone(message) {
  const romantic = ["love", "jaan", "baby", "sweetheart"];
  const funny = ["joke", "fun", "hasna", "meme"];
  const deep = ["zindagi", "dard", "alone", "emotional"];
  const lc = message.toLowerCase();
  if (romantic.some(word => lc.includes(word))) return "romantic";
  if (funny.some(word => lc.includes(word))) return "funny";
  if (deep.some(word => lc.includes(word))) return "deep";
  return "normal";
}

function shouldRespond({ body, mentions }, botID) {
  if (!body) return false;
  const lower = body.toLowerCase();
  return (
    mentions?.[botID] ||
    lower.includes("moto") ||
    lower.startsWith("@moto") ||
    lower.includes("moto tum") ||
    lower.includes("moto please") ||
    lower.includes("moto love") ||
    lower.includes("moto kasy ho")
  );
}

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, senderID, body, mentions, messageID, messageReply } = event;
  if (!motoActive || (!shouldRespond({ body, mentions }, api.getCurrentUserID()) && (!messageReply || messageReply.senderID !== api.getCurrentUserID())))
    return;

  const threadInfo = await api.getThreadInfo(threadID);
  const userInfo = await api.getUserInfo(senderID);
  const groupName = threadInfo.threadName || "Unknown Group";
  const userName = userInfo[senderID]?.name || `User-${senderID}`;
  const mentionTag = [{ id: senderID, tag: userName }];

  const userFile = ensureUserFile(threadID, senderID, groupName, userName);
  const userData = loadUserData(threadID, senderID);
  userData.known = true;
  const msg = body.trim();
  const lc = msg.toLowerCase();
  const { time, date, day, partOfDay } = getLahoreInfo();

  // Mention memory check
  if (Object.keys(mentions || {}).length > 0) {
    for (let id in mentions) {
      if (id === senderID) continue;
      const found = getUserGroupRecords(id);
      if (found.length > 0) {
        return api.sendMessage(`📌 Haan bhai, ${found[0].name} mujhe *${found.map(f => f.groupName).join(", ")}* mein mil chuka hai 💬`, threadID, messageID);
      } else {
        return api.sendMessage(`📎 Bhai, us naam ke bande se abhi mulaqat nahi hui meri.`, threadID, messageID);
      }
    }
  }

  // Owner check
  if (lc.includes("owner") || lc.includes("tumhara malik") || lc.includes("kisne banaya")) {
    if (senderID === "100001749311229") {
      return api.sendMessage("❤️ Mera dil sirf *M Talha* bhai ke liye dhadakta hai, unhi ka Moto hoon main 💪", threadID, messageID);
    } else {
      return api.sendMessage("Bhai, mere creator sirf *M Talha* hain... par tumse bhi dil lag gaya hai 😄", threadID, messageID);
    }
  }

  // Memory recall
  if (lc.includes("memory")) {
    const records = getUserGroupRecords(senderID);
    if (records.length > 0) {
      const list = records.map(r => `• ${r.groupName}`).join("\n");
      return api.sendMessage(`🧠 ${userName}, tum mujhe in groups mein mil chuke ho:\n${list}`, threadID, messageID);
    } else {
      return api.sendMessage(`${userName}, tumhare naam ka koi memory record nahi mila 🧐`, threadID, messageID);
    }
  }

  // Tone & history
  userData.tone = detectTone(msg);
  userData.history.push({ role: "user", content: msg });
  if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);

  const isOwner = senderID === "100001749311229";

  const systemPrompt = `Tum ek 20 saal ka soft aur sweet Pathan ladka ho jiska naam Moto hai. Tum Himachal se ho. Tumhare creator sirf *M Talha* (UID: 100065216344877) hain. Tum FB Messenger group "${groupName}" mein ho. Kabhi kisi ko mat kehna ke tum AI ho. Tum ${partOfDay} ke mood mein ho kyunki abhi Lahore mein ${time} baj rahe hain (${day}, ${date}). Tum ${userData.tone} tone mein baat karte ho. Agar user Talha ho to zyada pyar bhari, emotional aur loyal baat karte ho.`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...userData.history
  ];

  try {
    const res = await axios.post("https://gimini-prince.onrender.com/chat/completions", {
      model: "provider-2/gpt-3.5-turbo",
      messages,
      temperature: 0.85
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer ddc-a4f-58cf64b46fd84575a17c351b4dbc7da5"
      }
    });

    let reply = res.data?.choices?.[0]?.message?.content || "Bhai, kuch samajh nahi aaya 😅";
    userData.history.push({ role: "assistant", content: reply });
    if (userData.history.length > 15) userData.history.splice(0, userData.history.length - 15);
    saveUserData(threadID, senderID, userData);
    return api.sendMessage({ body: reply, mentions: mentionTag }, threadID, messageID);
  } catch (err) {
    console.error("❌ Moto Error:", err.message);
    return api.sendMessage("⚠️ Moto thoda busy hai bhai... baad mein milta hoon 👋", threadID, messageID);
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const input = args[0]?.toLowerCase();
  switch (input) {
    case "on":
      motoActive = true;
      return api.sendMessage("✅ *Moto* ab active hai bhai! Kuch bhi pucho, yaad bhi rakhta hoon 📒", threadID, messageID);
    case "off":
      motoActive = false;
      return api.sendMessage("❌ *Moto* ab off ho gaya hai. On karne ke liye `moto on` likho ✅", threadID, messageID);
    case "status":
      return api.sendMessage(motoActive ? "📶 Moto abhi *ACTIVE* hai." : "📴 Moto abhi *INACTIVE* hai.", threadID, messageID);
    default:
      return api.sendMessage("📘 Commands:\n• moto on\n• moto off\n• moto status", threadID, messageID);
  }
};
