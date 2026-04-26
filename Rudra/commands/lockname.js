const OWNER_UID = "100001749311229";
let lockedGroupNames = {};

module.exports.config = {
  name: "lockname",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Rudra x ChatGPT",
  description: "Lock group name. If changed, bot resets it. Owner-only.",
  commandCategory: "group",
  usages: "lockname lock/unlock/reset",
  cooldowns: 3
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, senderID } = event;
  if (senderID !== OWNER_UID) return api.sendMessage("⛔ Sirf Prince malik use kar sakta hai!", threadID);

  const subcmd = args[0]?.toLowerCase();
  if (!subcmd) return api.sendMessage("⚠️ Usage: lockname lock/unlock/reset <name>", threadID);

  switch (subcmd) {
    case "lock": {
      const name = args.slice(1).join(" ");
      if (!name) return api.sendMessage("❗ Naam bhi do!\nUsage: lockname lock Prince ", threadID);
      lockedGroupNames[threadID] = name;
      await api.setTitle(name, threadID);
      return api.sendMessage(`🔒 Group name lock ho gaya: ${name}`, threadID);
    }

    case "unlock": {
      delete lockedGroupNames[threadID];
      return api.sendMessage("🔓 Group name unlock ho gaya.", threadID);
    }

    case "reset": {
      if (!lockedGroupNames[threadID]) return api.sendMessage("⚠️ Koi naam lock nahi hai.", threadID);
      await api.setTitle(lockedGroupNames[threadID], threadID);
      return api.sendMessage(`♻️ Group name wapas reset kiya: ${lockedGroupNames[threadID]}`, threadID);
    }

    default:
      return api.sendMessage("⚠️ Usage: lockname lock/unlock/reset <name>", threadID);
  }
};

module.exports.lockedNames = lockedGroupNames;
