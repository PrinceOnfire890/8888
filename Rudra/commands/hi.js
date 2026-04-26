const moment = require("moment-timezone");

module.exports.config = {
  name: "hi",
  version: "12.0",
  hasPermssion: 0,
  credits: "Priyansh Rajput + Rudra Modified",
  description: "Hinglish Sanatani Swagat with Dynamic Borders",
  commandCategory: "🕉️ Sanatan Swag",
  usages: "auto",
  cooldowns: 5
};

module.exports.handleEvent = async ({ event, api, Users }) => {
  const triggers = [
    "hi", "hello", "radhe radhe", "jai shree ram", "har har mahadev",
    "namah shivay", "jai mata di", "ram ram", "shivay", "hare krishna", "bholenath"
  ];

  const thread = global.data.threadData.get(event.threadID) || {};
  if (typeof thread["hi"] == "undefined" || thread["hi"] == false) return;

  const userMsg = event.body?.toLowerCase();
  if (!triggers.includes(userMsg)) return;

  const stickerIDs = [
    "526214684778630", "526220108111421", "526220308111401", "526220484778050",
    "526220691444696", "526220814778017", "526220978111334", "526221104777988",
    "526221318111300", "526221564777942", "526221711444594", "526221971444568",
    "2041011389459668", "2041011569459650", "2041011726126301", "2041011836126290",
    "2041011952792945", "2041012109459596", "2041012262792914", "2041012406126233",
    "2041012539459553", "2041012692792871", "2041014432792697", "2041014739459333",
    "2041015016125972", "2041015182792622", "2041015329459274", "2041015422792598",
    "2041015576125916", "2041017422792398", "2041020049458802", "2041020599458747",
    "2041021119458695", "2041021609458646", "2041022029458604", "2041022286125245"
  ];
  const sticker = stickerIDs[Math.floor(Math.random() * stickerIDs.length)];

  const hours = moment.tz('Asia/Kolkata').format('HHmm');
  const session =
    hours <= 400 ? "🌌 Subah se pehle ka vibe" :
    hours <= 700 ? "🌄 Shubh Subah" :
    hours <= 1000 ? "☀️ Light wali morning" :
    hours <= 1200 ? "🍱 Brunch time" :
    hours <= 1700 ? "🌞 Afternoon chill" :
    hours <= 1900 ? "🌇 Shaam ki shanti" :
    "🌙 Raat ka sukoon";

  const name = await Users.getNameUser(event.senderID);

  const borders = [
    ["🔱┏━ॐ━┓🔱", "🔱┗━ॐ━┛🔱"],
    ["🌸━━✥ॐ✥━━🌸", "🌸━━✥ॐ✥━━🌸"],
    ["🚩〘", "〙🚩"],
    ["🕉️【", "】🕉️"],
    ["🔆➤", "➤🔆"],
    ["🙏❖", "❖🙏"],
    ["🌺〓", "〓🌺"],
    ["🔔⟦", "⟧🔔"],
    ["🛕<<", ">>🛕"],
    ["🌼╭", "╮🌼"]
  ];
  const [topBorder, bottomBorder] = borders[Math.floor(Math.random() * borders.length)];

  const msgs = [
    `${topBorder}\nRadhe Radhe ${name}!\n💖 Bhakti bhara ${session} ho tera!\n${bottomBorder}`,
    `${topBorder}\n🚩 Jai Shree Ram ${name} bhai!\n🔥 Ram ji ki kirpa ho iss ${session} mein!\n${bottomBorder}`,
    `${topBorder}\n🌸 Jai Mata Di ${name}!\n✨ Maa ki blessings ho tujpe aaj ke ${session} mein.\n${bottomBorder}`,
    `${topBorder}\n🔱 Har Har Mahadev ${name}!\n🕉️ Shiv ji ki energy full power me rahe tere saath.\n${bottomBorder}`,
    `${topBorder}\n🕉️ Namah Shivay ${name}!\n💫 Bholenath ki kripa sadaiv bani rahe.\n${bottomBorder}`,
    `${topBorder}\n🌼 Radha Krishna ka prem barse tere dil pe ${name}!\n💖 Anand le iss ${session} mein.\n${bottomBorder}`
  ];

  const reply = {
    body: msgs[Math.floor(Math.random() * msgs.length)],
    mentions: [{ tag: name, id: event.senderID }]
  };

  api.sendMessage(reply, event.threadID, () => {
    setTimeout(() => {
      api.sendMessage({ sticker }, event.threadID);
    }, 200);
  }, event.messageID);
};

module.exports.languages = {
  "en": {
    "on": "Hi module ab active ho gaya bhai! ✅",
    "off": "Hi module band kar diya gaya hai. ❌",
    "successText": ""
  }
};

module.exports.run = async ({ event, api, Threads, getText }) => {
  const { threadID, messageID } = event;
  const data = (await Threads.getData(threadID)).data;

  if (typeof data["hi"] == "undefined" || data["hi"] == true) data["hi"] = false;
  else data["hi"] = true;

  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);

  return api.sendMessage(`${data["hi"] ? getText("on") : getText("off")}`, threadID, messageID);
};
