const fs = require("fs-extra");
const path = require("path");

if (fs.existsSync(".env")) {
  require("dotenv").config({ path: path.join(__dirname, ".env") });
}

const config = {
  token: process.env.BOT_TOKEN || "", // Your bot token
  owner_id: process.env.OWNER_ID || "", // Your telegram chat id
  prefix: process.env.PREFIX || "/", // Your preferred prefix
  apiKey: process.env.API_KEY || "gifted", //Replace with your unlimited/paid apikey
  botName: process.env.BOT_NAME || "HUNTER MD",
  timezone: process.env.TIMEZONE || "Africa/Nairobi",
  ownerName: process.env.OWNER_NAME || "Obed Tech",
  ownerUsername: process.env.OWNER_USERNAME || "mauricehunter",
  apiUrl: process.env.API_URL || "https://api.giftedtech.co.ke", // Can replce with yours
  artistName: process.env.ARTIST_NAME || "Powered by Obed Tech",
  url: process.env.URL || "https://files.catbox.moe/924dcb.jpg",
  sourceUrl: process.env.SOURCE_URL || "https://github.com/Obedweb/Telegram-bot",

  greetNewMembers: {
    enabled: process.env.GREET_ENABLED !== "false",
    gifUrl: process.env.GIF_URL || "https://files.catbox.moe/pm9x7c.gif",
  },

  antiLink: {
    enabled: process.env.ANTILINK !== "false",
  },
};

const currentFile = require.resolve(__filename);
fs.watchFile(currentFile, () => {
  fs.unwatchFile(currentFile);
  console.log(`Updating ${path.basename(__filename)}`);
  delete require.cache[currentFile];
  require(currentFile);
});

module.exports = config;
