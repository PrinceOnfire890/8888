module.exports.config = {
  name: "tharki",
  version: "1.1",
  hasPermssion: 0,
  credits: "prince",
  description: "Non-prefix tharki replies + hacker demo + gaali + UID control",
  commandCategory: "fun",
  usages: "Auto trigger",
  cooldowns: 1,
};

const tharkiMsgs = [
  "Baby tere jaise curve toh Photoshop me bhi nahi milte! 🔥",
  "Tera kamar hilta hai toh bass speaker bhi sharma jaaye! 🔊",
  "Aisi smile... dil ki toh lassi ban gayi! 💦",
  "Oye tu shake kare toh earthquake aa jaye! 🌍",
  "Tere hot lips dekhke halwai bhi jalebi banana bhool jaaye! 💋",
  "Tu paas aaye toh AC bhi hot ho jaaye! 🔥",
  "Tumhare thumke dekhke mujhe pacemaker lagwana padega! 💓",
  "Tere jaise figure ke liye toh artist bhi pencil tod de! ✏️",
  "Tu samne ho toh DJ bhi bajna sharma jaaye! 🎧",
  "Tere aankhon mein kajal nahi... pura kaala jadoo hai! 👁️",
  "Tere jaisi girl ho toh internet ka bhi crash ho jaaye! 💻",
  "Tera body dekhke dumbbell bhi feel kar le jealous! 🏋️",
  "Tu toh asli tharki queen hai – mujhe bhi training de de! 😏",
  "Kya figure hai baby, GPS bhi raasta bhool jaaye! 🗺️",
  "Tere jaise peet pe tattoo toh dil pe attack lagta hai! ⚠️",
  "Aise walk karti hai jaise ramp hi sadak ho! 🔥",
  "Tu online ho jaaye toh pura Facebook tharki ho jaaye! 😈",
  "O baby, tu toh meri dirty fantasy ban gayi hai! 💭",
  "Teri har reel se toh zindagi feel hone lagti hai! 🎬",
];

const hackerReplies = [
  "⚠️ Hacking Firewall Active: IP traced, system breach blocked.",
  "⚠️ Warning: Gaali detect hui hai, target marked for demo hack.",
  "💀 Rudra Mode Activated – Bot ko chhedne ka result milega!",
  "👁 Bot: Trace started, virtual attack ready!",
  "🔐 Hack simulation running... teri ID ab safe nahi!",
  "🤖 Tumne hacker ko chheda hai... ab bhugto!",
];

const gaaliReplyBasic = [
  "Oye chhoti soch wale, tu apni aukaat me reh! 🖕",
  "Gaali deta hai? Tere jaise toh recycle bin me hi ache lagte hain!",
  "Tere jaise logon ke liye delete button invent hua tha! 🗑️",
  "Gaali dena band kar warna bot teri gaand tape karega! 🔨",
  "Apne baap se baat karne ki tameez seekh le pehle! ☠️",
  "Gaali deke macho ban raha hai? Jaa pehle mirror dekh! 🪞",
  "Bot ko chheda? Ab tujhe system se logout milega! 🔒",
  "Chup be moorkh! Tu toh AI ke bhi blacklist me hai! 🛑",
];

const gaaliReplyBold = [
  "Oye bhosdike, teri maa ki choot mein kali mirch aur hing mila ke chakhwa dunga! 🌶️🧂😡",
  "Teri maa ki bhen ke chode pe itna joota maarunga ki wo poore gali mein goonjega! 👞💥",
  "Madarchod, tere baap ki aukaat bhi meri choot ke saamne kuch nahi! Samjha kya? 🤜😤",
  "Teri maa ke laude, teri aukaat itni kam hai ki main tujhe pairon ke neeche daba dunga! 👣🔥",
  "Behen ke laude, teri choot ke taar tod ke main tujhe hawa mein uda dunga! 💨😠",
  "Oye gandu, teri maa ki bhen ke chode mein keede paida kar ke tujhe tang kar dunga! 🐛🤮",
  "Teri maa ke laude, mere saamne mat bol warna teri zindagi ka phone band kar dunga! 📵💥",
  "Teri maa ki bhen ko itna dhakka marunga ki wo poore shehar mein famous ho jayegi! 🤼‍♂️😵",
  "Chutiye, teri aukaat samajh ke baat kar warna teri mooh ki halat kharab kar dunga! 🤬👊",
  "Madarchod, teri maa ki choot mein itna hing daal dunga ki uska poora mooh bandh ho jayega! 🤐🔥",
  "Oye harami, teri maa ki chut me rudra ka or mera lohe ka loda dalke teri ma ki chut ko fadduga ! 🔪😡",
  "Tere baap ki gand mein itna dhoom macha dunga ki wo hamesha ke liye band ho jayegi! 🚫🔥",
  "Teri maa ki bhen ke chut  mein pathar daal ke use fad dunga loda dalunga apna to teri bhn chikegi rudra ji maza aara or dalo thoda thoda dunga! 🪨💥",
  "Tere jaisa gandu samajh leta ki baat karni hai toh izzat se kar! 🚷😤",
  "Tere baap ke laude, teri aukaat dekh ke main tujhe thappad se hawa mein uda dunga! 👋💨",
  "Oye madarchod, teri maa ke bhen ko aise CHODUNGA  ki wo hil jayegi! 🤤😵",
  "Teri maa ki bhen ki gaand mein mirchi daal ke uski saanson ko bandh kar dunga! 🌶️😷",
  "Tere jaise chutiye ko samjhaane ke liye main aag laga ke jala dunga! 🔥😡",
  "Teri maa ke bhen ke chode mein danda ghusa ke tujhe sikha dunga! 🪵🤬",
  "Teri aukaat nahi ki mere samne baat kare, warna tod dunga! 👊😤",
  "Tere baap ki choot mein itna joota maarunga ki wo kabhi theek nahi hogi! 👞🚫",
  "Teri maa ke bhen ke chode mein kali mirch aur namak mila ke tujhe tadpa dunga! 🌶️🧂🔥",
  "Oye chutiye, teri maa ki bhen ko itna maarunga ki wo chilla ke poore gali mein aawaz macha degi! 📢😵",
  "Tere jese gandus ko main har roz thappad maara karta hoon! 👋🤬",
  "Teri maa ke CHUT, teri aukaat samajh ke baat kar warna tod dunga! 👊🔥",
  "Tere baap ke GAND PE , tere sar par aisa joota padega ki wo toot jayega! 👞🤯",
  "Teri maa ki bhen ke chut mein mera lohe ka lund FEK KE  maar ke uski zindagi khatam kar dunga! 🪨💥",
  "Oye bhosdike, teri aukaat dekh ke main tujhe hawa mein uda dunga! 💨😠",
  "Teri maa ki chut mein mirchi daal ke tujhe sahi sahi sikhata hoon! 🌶️😡",
  "Tere jese gandus ko main apne pairon tale rakhunga! 👣🔥",
  "Teri maa ke bhen ke chUTT  mein bomb daal ke hawa mein udaAAA  dunga LEKIN UDANE SE PHLE CHODUGA JRURR! 💣🤯",
  "Teri aukaat nahi ki mere samne baat kare, warna tod dunga! 👊💥",
  "Oye madarchod, teri maa ki bhen ke chUT mein aag laga ke tujhe USI ME GHUSAKA jala dunga! 🔥😤",
  "Tere jaise gandus ko main kabhi maaf nahi karta! 🚫🤬",
  "Teri maa ki bhen ke chUT mein MERE PALTU KALE KUTE SE TERI MA BHN KO CHUDWADUNGA  pathar ! 🪨🖤",
  "Oye bhosdike, teri aukaat dekh ke main tujhe thappad se gira dunga! 👋😵",
  "Tere baap kA lauDA KAM NHI KARTA ISLIE TERI MA MUKHSE CHUDTI HH OR TERI BHN MERA LUND CHUSTI HH  teri bhn KI CHUT PE ME ROJ  thappad mar TA HU! 👋🔥",
  "Tere jese gandus ko main kabhi nahi chhodta! 🚫😤",
];

const adminUID = "61550558518720";

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, senderID, body } = event;
  if (!body) return;

  const lower = body.toLowerCase();

  // Hack trigger (only admin)
  if (senderID === adminUID && lower.includes("hack kr") && lower.includes("id")) {
    return api.sendMessage(
      "⚠️ Hack simulation started for target ID...\n[████░░░░░░░░░░] 25%\nSystem breach in process...\n[██████████░░░░] 80%\nDemo complete. Hack activated (start).",
      threadID
    );
  }

  // Gaali + rudra/bot check
  const gaaliList = [
    "chutiya", "gandu", "bhosdike", "madarchod", "teri ma ki", "bc", "mc"
  ];
  const mentionedBot = lower.includes("bot") || lower.includes("rudra");
  const saidGaali = gaaliList.some((word) => lower.includes(word));

  if (saidGaali && mentionedBot) {
    // Mix basic and bold gaali replies randomly
    const allGaaliReplies = [...gaaliReplyBasic, ...gaaliReplyBold];
    const gali = allGaaliReplies[Math.floor(Math.random() * allGaaliReplies.length)];
    const hack = hackerReplies[Math.floor(Math.random() * hackerReplies.length)];
    return api.sendMessage(`${gali}\n\n${hack}`, threadID);
  }

  // Tharki reply on "tharki" word
  if (lower.includes("tharki")) {
    const reply = tharkiMsgs[Math.floor(Math.random() * tharkiMsgs.length)];
    return api.sendMessage(reply, threadID);
  }
};

module.exports.run = () => {};
