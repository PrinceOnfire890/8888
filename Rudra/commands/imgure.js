const axios = require('axios');

module.exports.config = {
    name: "imgur",
    usePrefix: false,
    version: "1.0",
    credits: "Nazrul (Modified by Mirrykal)",
    cooldowns: 5,
    hasPermission: 0,
    description: "Upload image or video to Imgur by replying to a photo or video",
    commandCategory: "tools",
    usages: "vimgur [image, video]"
};

module.exports.run = async function ({ api, event }) {
    const link = event.messageReply?.attachments[0]?.url || event.attachments[0]?.url;

    if (!link) {
        return api.sendMessage('Please reply to an image or video.', event.threadID, event.messageID);
    }

    try {
        const res = await axios.get(`https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json`);
        const apiUrl = res.data.csb;

        const uploadRes = await axios.get(`${apiUrl}/nazrul/imgur?link=${encodeURIComponent(link)}`);
        const uploaded = uploadRes.data.uploaded;

        if (uploaded.image) {
            return api.sendMessage(uploaded.image, event.threadID, event.messageID);
        } else {
            return api.sendMessage('Failed to upload image or video to Imgur.', event.threadID, event.messageID);
        }
    } catch (error) {
        console.error("Error uploading to Imgur:", error);
        return api.sendMessage('An error occurred while uploading the image or video to Imgur.', event.threadID, event.messageID);
    }
};
