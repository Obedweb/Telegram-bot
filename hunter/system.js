const { gmd } = require('../hunt');
const { formatUptime, copyFolderSync } = require('../hunt/gmdUtils');
const { axios, fs, path } = require('../hunt/gmdHelpers');
const os = require('os');
const AdmZip = require("adm-zip");

gmd({
    pattern: "restart",
    aliases: ["reboot", "reset"],
    react: "🫡",
    category: "system",
    description: "Restart the bot",
    owneronly: true,
    cooldown: 5
},

async (msg, Hunter, conText) => {
    const { reply } = conText;
    try {
        await reply(
            `🔄 *Restarting Hunter MD...*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `⏳ Please wait a moment.\n` +
            `✅ Bot will be back online shortly.`
        );
        setTimeout(() => process.exit(0), 2000);
    } catch (error) {
        await reply(`❌ *Restart Failed*\n_${error.message}_`);
    }
});

gmd({
    pattern: "update",
    aliases: ["updatenow", "sync"],
    react: "🔥",
    category: "system",
    description: "Update the bot to the latest version",
    owneronly: true,
    cooldown: 10
},

async (msg, Hunter, conText) => {
    const { reply } = conText;

    try {
        await reply(
            `🔍 *Checking for updates...*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `_Fetching latest commit info_`
        );

        const { data: commitData } = await axios.get("https://api.github.com/repos/mauricehunter/telegram-bot/commits/main");
        const latestCommitHash = commitData.sha;

        const commitFile = path.join(__dirname, '..', 'hunt', 'current_commit.txt');
        let currentHash = '';
        if (fs.existsSync(commitFile)) {
            currentHash = fs.readFileSync(commitFile, 'utf8').trim();
        }

        if (latestCommitHash === currentHash) {
            return await reply(
                `✅ *Already Up-to-Date!*\n` +
                `━━━━━━━━━━━━━━━━\n` +
                `_Hunter MD is running the latest version._`
            );
        }

        const authorName = commitData.commit.author.name;
        const commitDate = new Date(commitData.commit.author.date).toLocaleString();
        const commitMessage = commitData.commit.message;

        await reply(
            `📦 *Update Found!*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `👤 *Author:* ${authorName}\n` +
            `📅 *Date:* ${commitDate}\n` +
            `💬 *Message:* ${commitMessage}\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `📥 Downloading update...`
        );

        const zipPath = path.join(__dirname, '..', 'telegram-bot-latest.zip');
        const { data: zipData } = await axios.get("https://github.com/mauricehunter/telegram-bot/archive/main.zip", {
            responseType: "arraybuffer"
        });
        fs.writeFileSync(zipPath, zipData);

        const extractPath = path.join(__dirname, '..', 'latest');
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractPath, true);

        copyFolderSync(path.join(extractPath, 'telegram-bot-main'), path.join(__dirname, '..'));
        fs.writeFileSync(commitFile, latestCommitHash);
        fs.unlinkSync(zipPath);
        fs.rmSync(extractPath, { recursive: true, force: true });

        await reply(
            `✅ *Update Complete!*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `🔄 Restarting Hunter MD...`
        );
        setTimeout(() => process.exit(0), 2000);

    } catch (error) {
        await reply(`❌ *Update Failed*\n_${error.message}_\n_Please try again manually._`);
    }
});

gmd({
    pattern: "ping",
    aliases: ["speed", "test"],
    react: "⚡",
    category: "system",
    description: "Check bot response time",
    cooldown: 3
},

async (msg, Hunter, conText) => {
    const { reply } = conText;
    try {
        const startTime = Date.now();
        const sentMessage = await reply(`⚡ *Pinging...*`);
        const pingTime = Date.now() - startTime;

        const quality = pingTime < 200 ? '🟢 Excellent' : pingTime < 500 ? '🟡 Good' : '🔴 Slow';

        await Hunter.editMessageText(
            `🏓 *Pong!*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `⚡ *Latency:* ${pingTime}ms\n` +
            `📶 *Quality:* ${quality}\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `_Hunter MD is online_`,
            {
                chat_id: conText.chatId,
                message_id: sentMessage.message_id,
                parse_mode: 'Markdown'
            }
        );
    } catch (error) {
        await reply(`❌ *Ping Error*\n_${error.message}_`);
    }
});

gmd({
    pattern: "uptime",
    aliases: ["up", "status"],
    react: "💯",
    category: "system",
    description: "Display bot statistics",
    cooldown: 5
},

async (msg, Hunter, conText) => {
    const { reply, botName } = conText;
    try {
        const uptime = process.uptime();
        const memMB = (process.memoryUsage().rss / (1024 * 1024)).toFixed(2);
        const cpuLoad = os.loadavg()[0].toFixed(2);
        const platform = os.platform();
        const nodeVer = process.version;

        const out =
            `📊 *${botName} — System Status*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `⏳ *Uptime:* ${formatUptime(uptime)}\n` +
            `💾 *Memory:* ${memMB} MB\n` +
            `⚡ *CPU Load:* ${cpuLoad}\n` +
            `🖥 *Platform:* ${platform}\n` +
            `🟢 *Node.js:* ${nodeVer}\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `_All systems operational_`;

        await reply(out, { parse_mode: 'Markdown' });
    } catch (error) {
        await reply(`❌ *Stats Error*\n_${error.message}_`);
    }
});
