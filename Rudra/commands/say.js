module.exports.config = {
	name: "say",
	version: "2.0.0",
	hasPermssion: 0,
	credits: "Priyansh Rajput & Modified by Rudra",
	description: "Bot speaks the text using Google TTS with auto language detection (Hindi, Hinglish, English)",
	commandCategory: "media",
	usages: "[hi/en/auto] [Text]",
	cooldowns: 5,
	dependencies: {
		"path": "",
		"fs-extra": ""
	}
};

module.exports.run = async function({ api, event, args }) {
	const { createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
	const { resolve } = global.nodemodule["path"];
	try {
		if (!args[0]) return api.sendMessage("❌ Please provide text to speak.\nExample: +say auto mujhe pyaar ho gaya", event.threadID, event.messageID);

		const content = (event.type === "message_reply") ? event.messageReply.body : args.join(" ");
		let lang = "auto", msg = content;

		// Check prefix lang
		const firstWord = args[0].toLowerCase();
		const supportedLangs = ["hi", "en", "ja", "ru", "tl"];
		if (supportedLangs.includes(firstWord)) {
			lang = firstWord;
			msg = args.slice(1).join(" ");
		}

		// Auto detect for Hinglish/Hindi
		if (lang === "auto") {
			const hindiPattern = /[क-हाि-ॣ़ा़ेैोौंःँ]/; // Hindi Unicode range
			lang = hindiPattern.test(msg) ? "hi" : "hi"; // Force Hindi for Hinglish too
		}

		const filePath = resolve(__dirname, "cache", `${event.threadID}_${event.senderID}.mp3`);
		const ttsURL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${lang}&client=tw-ob`;

		await global.utils.downloadFile(ttsURL, filePath);
		return api.sendMessage({ attachment: createReadStream(filePath) }, event.threadID, () => unlinkSync(filePath), event.messageID);
		
	} catch (err) {
		console.error("[ SAY ERROR ]", err);
		return api.sendMessage("🚫 Error generating speech. Try again later.", event.threadID, event.messageID);
	}
};
