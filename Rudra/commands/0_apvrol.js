module.exports.config = {
  name: "approve",
  version: "1.0.2",
  hasPermssion: 2,
  credits: "Fixed by Talha ✨",
  description: "Approve or manage group access to the bot",
  commandCategory: "Admin",
  cooldowns: 5
};

const fs = require("fs");
const path = require("path");

const priyanshuDir = path.join(__dirname, "Priyanshu");
if (!fs.existsSync(priyanshuDir)) fs.mkdirSync(priyanshuDir);

const cacheDir = path.join(__dirname, "cache");
if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

const dataPath = path.join(priyanshuDir, "approvedThreads.json");
const dataPending = path.join(priyanshuDir, "pendingThreads.json");
const gifPath = path.join(cacheDir, "approved_by_talha.gif");

// Load assets on bot start
module.exports.onLoad = () => {
  if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));
  if (!fs.existsSync(dataPending)) fs.writeFileSync(dataPending, JSON.stringify([]));

  const sourceGif = path.join(__dirname, "assets", "talha_approval.gif");
  if (!fs.existsSync(gifPath) && fs.existsSync(sourceGif)) {
    fs.copyFileSync(sourceGif, gifPath);
  }
};

module.exports.run = async ({ event, api, args, Threads }) => {
  const { threadID, messageID } = event;
  const { sendMessage, getThreadInfo } = api;

  let data = JSON.parse(fs.readFileSync(dataPath));
  let dataP = JSON.parse(fs.readFileSync(dataPending));
  let idBox = args[1] || threadID;

  try {
    switch (args[0]?.toLowerCase()) {
      case "list":
      case "l": {
        if (data.length === 0) return sendMessage("⚠️ No approved groups yet.", threadID, messageID);
        let msg = `🌟 Approved Groups [${data.length}]:\n\n`;
        for (let i = 0; i < data.length; i++) {
          try {
            const info = await getThreadInfo(data[i]);
            msg += `🔹 ${i + 1}. ${info.threadName || "Unknown Group"}\n🆔 ID: ${data[i]}\n\n`;
          } catch {
            msg += `🔹 ${i + 1}. [Couldn’t fetch name]\n🆔 ID: ${data[i]}\n\n`;
          }
        }
        return sendMessage(msg, threadID, messageID);
      }

      case "pending":
      case "p": {
        if (dataP.length === 0) return sendMessage("⏳ No pending approvals.", threadID, messageID);
        let msg = `🔐 Pending Approval Groups [${dataP.length}]:\n\n`;
        for (let i = 0; i < dataP.length; i++) {
          try {
            const info = await getThreadInfo(dataP[i]);
            msg += `🔸 ${i + 1}. ${info.threadName || "Unknown Group"}\n🆔 ID: ${dataP[i]}\n\n`;
          } catch {
            msg += `🔸 ${i + 1}. [Couldn’t fetch name]\n🆔 ID: ${dataP[i]}\n\n`;
          }
        }
        return sendMessage(msg, threadID, messageID);
      }

      case "help":
      case "h": {
        const prefix = global.config.PREFIX || "*";
        return sendMessage(
          `🌐 𝗔𝗣𝗣𝗥𝗢𝗩𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗠𝗘𝗡𝗨 🌐\n\n` +
          `📌 ${prefix}approve list / l → Show approved groups\n` +
          `📌 ${prefix}approve pending / p → Show pending groups\n` +
          `📌 ${prefix}approve del / d <ID> → Remove group approval\n` +
          `📌 ${prefix}approve <ID> → Approve a group\n\n` +
          `👑 𝗢𝗪𝗡𝗘𝗥: 𝗧𝗔𝗟𝗛𝗔 𝗣𝗔𝗧𝗛𝗔𝗡`,
          threadID, messageID
        );
      }

      case "del":
      case "d": {
        if (!data.includes(idBox)) return sendMessage("❌ Group not approved yet!", threadID, messageID);
        data = data.filter(e => e !== idBox);
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return sendMessage("✅ Group removed from approved list.", threadID, messageID);
      }

      default: {
        if (isNaN(idBox)) return sendMessage("⚠️ Please enter a valid numeric group ID.", threadID, messageID);
        if (data.includes(idBox)) return sendMessage("⚠️ This group is already approved.", threadID, messageID);

        // Approve the group
        data.push(idBox);
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        if (dataP.includes(idBox)) {
          dataP = dataP.filter(e => e !== idBox);
          fs.writeFileSync(dataPending, JSON.stringify(dataP, null, 2));
        }

        // Send fancy message with optional image
        const message = {
          body:
            `╔══【🌟 𝗕𝗢𝗧 𝗔𝗣𝗣𝗥𝗢𝗩𝗘𝗗 🌟】══╗\n\n` +
            `🎀 𝗕𝗢𝗧 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟𝗟𝗬 🎀\n\n` +
            `✨ Group has been approved by 👑 𝑻𝒂𝒍𝒉𝒂 𝑷𝒂𝒕𝒉𝒂𝒏 ✨\n` +
            `────────────────────────────\n` +
            `🔰 Use "*help" to see available commands\n\n` +
            `📚 Examples:\n` +
            `│ 🎵 *music – Play songs\n` +
            `│ 🎥 *video – Watch videos\n` +
            `│ 🧾 *info – Bot info\n` +
            `│ 🛠️ *help – Command list\n` +
            `────────────────────────────\n\n` +
            `🌐 Facebook: https://www.facebook.com/share/193GypVyJQ/\n` +
            `📞 Contact Owner: 𝗧𝗔𝗟𝗛𝗔 𝗣𝗔𝗧𝗛𝗔𝗡\n` +
            `💌 Thanks for using 𝗠𝗼𝘁𝗼 𝗕𝗼𝘁!\n\n` +
            `╚═════【❤️】═════╝`,
          attachment: fs.existsSync(gifPath)
            ? fs.createReadStream(gifPath)
            : undefined // 📌 Optionally replace with your image: fs.createReadStream("cache/yourimage.jpg")
        };

        await sendMessage(message, idBox);
        return sendMessage(`✅ Group ${idBox} has been approved successfully!`, threadID, messageID);
      }
    }
  } catch (err) {
    console.error(err);
    return sendMessage("🚫 An error occurred while approving the group.", threadID, messageID);
  }
};
