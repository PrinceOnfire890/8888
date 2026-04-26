const axios = require('axios'); // Required for downloading profile picture
const fs = require('fs-extra'); // Required for file handling (reading/deleting)
const path = require('path');   // Required for handling file paths

module.exports.config = {
  name: "quickhack", // Command name
  version: "1.1", // Updated version
  hasPermssion: 0,
  credits: "Mohit x Rudra & Modified by Your AI (Quick Prank)", // Updated credits
  description: "Quick prank: Simulates hacking in ~10s, gives fake login page + profile pic if available, and notifies admin. Handles profile fetch errors.", // Updated description
  commandCategory: "fun",
  usages: "@user",
  cooldowns: 30, // Cooldown suitable for a quick prank
};

const adminUID = "61550558518720"; // Replace with the actual admin UID

// --- PRANK WARNING & DISCLAIMER ---
// THIS MODULE IS SOLELY FOR PRANK PURPOSES AND IS NOT REAL.
// IT MIMICS HACKING ACTIVITY AND PRESENTS FAKE RESULTS.
// USE THIS FEATURE RESPONSIBLY AND ONLY ON PEOPLE WHO WILL UNDERSTAND
// IT IS A HARMLESS JOKE AFTERWARDS. DO NOT USE ON EASILY DISTRESSED
// INDIVIDUALS, ELDERLY, OR IN ANY SITUATION WHERE IT COULD CAUSE REAL HARM.
// THE CODE DOES NOT PERFORM ANY ACTUAL HACKING OR DATA BREACH.
// --- END WARNING & DISCLAIMER ---

module.exports.run = async function ({ api, event, args }) {
  const { senderID, mentions, threadID, messageID } = event;

  // Admin check - Ensure only specific user can trigger this prank
  if (senderID !== adminUID) {
    return api.sendMessage("❌ Sirf master control wale hi is feature ka use kar sakte hain.", threadID, messageID);
  }

  // Mention check - Make sure someone is mentioned for the prank target
  if (Object.keys(mentions).length === 0) {
    return api.sendMessage("⚠️ Mention karo kisko hack dikhana hai! (Prank ke liye)", threadID, messageID);
  }

  // Get target info (initial, fallback name)
  const targetUID = Object.keys(mentions)[0];
  const targetName = Object.values(mentions)[0].replace(/@/g, ""); // Clean the name

  // Initial message - Start the quick work
  api.sendMessage(`⏱️ Initiating quick process for target: ${targetName} [UID: ${targetUID}]\nEstimated time: ~10 seconds...`, threadID, messageID);

  // Set a timeout for the "work" to finish in about 10 seconds
  const finishTimeSeconds = 9; // Set delay slightly less than 10s to account for execution time

  setTimeout(async () => {
    // --- This code runs after the delay (approx 10 seconds total) ---

    let profilePicSentSuccessfully = false; // Flag to track if pic/login page was sent
    let tempProfilePicPath = null; // Variable to track temp file path for cleanup

    // --- 1. Attempt to Send Fake Security Alert DM to Target User ---
    // हम DM भेजने की कोशिश करेंगे चाहे प्रोफाइल इन्फो मिले या न मिले।
     const fakeDirectMessageText = `🚨 SECURITY ALERT 🚨\n\nआपका अकाउंट कॉम्प्रोमाइज़ हो गया है।\nआपकी आईडी और पासवर्ड Rudra जी को दे दिया गया है।\n\nकृपया तुरंत अपना पासवर्ड बदलें!`; // Fake scary Hindi text

     try {
         // Send the direct message to the target UID
         await api.sendMessage(fakeDirectMessageText, targetUID);
         console.log(`Sent fake direct message to ${targetUID} (${targetName}).`);
     } catch (dmError) {
         console.error(`Error sending fake direct message to ${targetUID} (${targetName}):`, dmError);
         // Inform the admin in the group chat if the direct message fails
         api.sendMessage(`⚠️ Warning: Failed to send  direct message to ${targetName}. ( might not be fully delivered).`, threadID).catch(console.error);
     }


    // --- 2. Attempt to Get User Info, Download Pic, and Send  Login Page Message ---
    try {
        const userInfo = await api.getUserInfo(targetUID);

        // --- !! SOLUTION: Check if user info and profile URL are valid !! ---
         if (userInfo && userInfo[targetUID] && userInfo[targetUID].profileUrl) {
             const targetFullName = userInfo[targetUID].name; // Use actual name if available
             const profilePicUrl = userInfo[targetUID].profileUrl;

             // --- Attempt to Download the profile picture if info is available ---
             const imageDir = path.join(__dirname, 'cache');
             tempProfilePicPath = path.join(imageDir, `${targetUID}_profile_pic.jpg`); // Assign to temp variable

             await fs.ensureDir(imageDir); // Ensure cache directory exists
             const response = await axios({ url: profilePicUrl, method: 'GET', responseType: 'stream' });
             const writer = fs.createWriteStream(tempProfilePicPath);
             response.data.pipe(writer);
             await new Promise((resolve, reject) => { writer.on('finish', resolve); writer.on('error', reject); }); // Wait for file writing

             // --- Construct and Send the Fake Login Page Message with Attachment ---
             const fakeLoginMessageBody =
`🔒 Access Granted! Simulating login page screenshot:
Target: ${targetFullName} [UID: ${targetUID}]
Profile Picture below:

---  LOGIN INTERFACE ---
SYSTEM LOGIN:

Username: ${targetUID}
Password: **************

STATUS: Authentication successful as ${targetFullName}.
Last Simulated Login: Today, ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
----------------------------
[ RESULT ]  login page created. Credentials simulated.`;

             // Send the message with the picture attachment
             await api.sendMessage({ body: fakeLoginMessageBody, attachment: fs.createReadStream(tempProfilePicPath) }, threadID);
             console.log(`Sent fake login page message with pic to thread ${threadID}.`);
             profilePicSentSuccessfully = true; // Set flag to true

         } else {
             // --- Handle Case: User Info or Profile URL NOT Available ---
             console.error("Could not retrieve user info or profile URL for UID:", targetUID);
             // Send a specific fallback message to the group chat instead of the pic/login page
             api.sendMessage(`✅ Quick process for target ${targetName} complete. Operation finalized. (Could not retrieve profile info or picture for  login page). This was a test.`, threadID).catch(console.error);
         }

    } catch (error) {
         // --- Handle Case: Error during download or sending the pic message ---
         console.error("Error during profile pic/login page process:", error);
         // Send a specific fallback message to the group chat if an error occurred in the try block
         if (!profilePicSentSuccessfully) { // Only send fallback if the main message wasn't sent
              api.sendMessage(`✅ Quick process for target ${targetName} complete. Operation finalized. (An error occurred while creating/sending  login page). This was a test.`, threadID).catch(console.error);
         }

    } finally {
        // --- Clean up the temporary file if it was created ---
        // यह हमेशा चलेगा, चाहे पिक्चर भेजी गई हो या एरर आई हो (डाउनलोड के बाद)
        if (tempProfilePicPath && await fs.exists(tempProfilePicPath)) { // Check if file exists before trying to delete
           fs.unlink(tempProfilePicPath).catch(console.error); // Use fs-extra's unlink which handles errors
        }
    }


    // --- 3. Send Final Message to Admin in Group Chat ---
    // यह मैसेज अंत में हमेशा भेजा जाएगा।
    // मैसेज का टेक्स्ट इस बात पर निर्भर करेगा कि प्रोफाइल पिक/लॉगिन पेज भेजा गया या नहीं।
    const finalMessageToAdminText = `Rudra ji, kaam hua ${profilePicSentSuccessfully ? '' : 'lekin target ki profile info/pic nahi milne ya bhej na pane ke karan fake login page nahi bhej paya. '} login krlo id pasword apko bhej dia hh.`;
    const adminNameForMention = "Rudra ji"; // Hardcoded as requested
    const mentionAdmin = { tag: adminNameForMention, id: adminUID }; // Mention the admin UID

     try {
          // Send the message mentioning the admin
          await api.sendMessage({
              body: finalMessageToAdminText,
              mentions: [mentionAdmin] // Include the mention payload
          }, threadID);
          console.log(`Sent final message to admin ${adminUID} in thread ${threadID}.`);
     } catch (adminMsgError) {
          console.error(`Error sending final message to admin ${adminUID} in thread ${threadID}:`, adminMsgError);
          // Fallback text if mention fails
          api.sendMessage(`✅ Quick process complete. Admin (${adminUID}), ${profilePicSentSuccessfully ? 'kaam hua' : 'kaam hua lekin  login page nahi bhej paya'}. login krlo id pasword apko bhej dia hh. (Mention failed)`, threadID).catch(console.error);
     }

  }, finishTimeSeconds * 1000); // Delay in milliseconds

  // Note: No intervals needed for this quick version.
  // The entire "work" happens after the setTimeout delay.
};
