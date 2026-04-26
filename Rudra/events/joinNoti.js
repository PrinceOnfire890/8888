module.exports.config = {
	name: "join",
	eventType: ["log:subscribe"],
	version: "1.0.1",
	credits: "MTX",
	description: "join and welcome notification",
	dependencies: {
		"fs-extra": ""
	}
};

module.exports.run = async function({ api, event,Threads }) {
	const { join } = global.nodemodule["path"];
	const { threadID } = event;
	const data = (await Threads.getData(event.threadID)).data || {};
    const checkban = data.banOut || []
	if  (checkban.includes(checkban[0])) return
	else if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
api.changeNickname(`« ${global.config.PREFIX} » ❲ ${(!global.config.BOTNAME) ? "shanghai" : global.config.BOTNAME} ai ❳`, threadID, api.getCurrentUserID());
		return api.sendMessage(`[ • ] bot connected successfully ✅\n……………………………………………\n「 informations 」\n  ❯ bot name : ${global.config.BOTNAME}\n  ❯ bot prefix : ${global.config.PREFIX}\n  ❯users : ${global.data.allUserID.length}\n  ❯ groups : ${global.data.allThreadID.length}\n\n「 usage 」\n  ❯ Type ${global.config.PREFIX}help to see command list\n  ❯ ${global.config.BOTNAME} (question)\n  ❯ talk (text)\n……………………………………………\n[ • ] thank you for using ${global.config.BOTNAME} bot`, threadID);
	}
	else {
		try {
			const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
			let { threadName, participantIDs } = await api.getThreadInfo(threadID);

			const threadData = global.data.threadData.get(parseInt(threadID)) || {};

			var mentions = [], nameArray = [], memLength = [], i = 0;
			
			for (id in event.logMessageData.addedParticipants) {
				const userName = event.logMessageData.addedParticipants[id].fullName;
				nameArray.push(userName);
				mentions.push({ tag: userName, id });
				memLength.push(participantIDs.length - i++);
			}
			memLength.sort((a, b) => a - b);
			
			(typeof threadData.customJoin == "undefined") ? msg = "𝗛𝗘𝗟𝗟𝗢 𝗗𝗘𝗔𝗥 🥰, {name}, [[ ==> ⚡ 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 𝗧𝗢 ⚡ {threadName}" : msg = threadData.customJoin;
			msg = msg
			.replace(/\{name}/g, nameArray.join(', '))
			.replace(/\{type}/g, (memLength.length > 1) ?  'friends' : 'you')
			.replace(/\{soThanhVien}/g, memLength.join(', '))
			.replace(/\{threadName}/g, threadName);

			let formPush = { body: msg, mentions }

			return api.sendMessage(formPush, threadID);
		} catch (e) { return console.log(e) };
	}
}
