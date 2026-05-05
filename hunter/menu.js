const { gmd, commands } = require('../hunt');
const { getCategoryIcon, formatUptime, buildButtons, urlButton } = require('../hunt/gmdUtils');
const { monospace, formatBytes } = require('../hunt/gmdHelpers');
const config = require('../config');
const os = require('os');

const ram = `${formatBytes(os.freemem())}/${formatBytes(os.totalmem())}`;

gmd({
    pattern: "menu",
    aliases: ["help", "cmd", "allmenu", "start"],
    react: "👀",
    category: "general",
    description: "Show all commands",
    cooldown: 5
},

async (msg, Hunter, conText) => {
    const { pushName, botName, prefix } = conText;
    const tz = config.timezone || 'Africa/Nairobi';

    const now = new Date();
    const date = new Intl.DateTimeFormat('en-GB', {
        timeZone: tz,
        day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(now);

    const time = new Intl.DateTimeFormat('en-GB', {
        timeZone: tz,
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    }).format(now);

    const uptime = formatUptime(process.uptime());
    const totalCommands = commands.filter(c => c.pattern && !c.dontAddCommandList).length;
    const user = msg.from.username ? `@${msg.from.username}` : (pushName || 'User');

    let header = `🎯 *${monospace(botName)}*\n`;
    header += `▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸\n\n`;
    header += `👤 *User* › ${user}\n`;
    header += `👑 *Owner* › @${config.ownerUsername}\n`;
    header += `⌨️ *Prefix* › \`${prefix}\`\n`;
    header += `🧩 *Plugins* › ${totalCommands} loaded\n`;
    header += `⏳ *Uptime* › ${uptime}\n`;
    header += `🕐 *Time* › ${time}\n`;
    header += `📅 *Date* › ${date}\n`;
    header += `💾 *RAM* › ${monospace(ram)}\n\n`;
    header += `▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸▸`;

    let categoryList = '\n';
    for (const category of Object.keys({}).constructor === Object
        ? Object.keys(
            commands.reduce((acc, cmd) => {
                if (cmd.pattern && !cmd.dontAddCommandList) {
                    const cat = cmd.category || 'misc';
                    if (!acc[cat]) acc[cat] = [];
                    acc[cat].push(cmd.pattern);
                }
                return acc;
            }, {})
        ).sort()
        : []
    ) {
        // handled below
    }

    const categorized = {};
    commands.forEach(cmd => {
        if (cmd.pattern && !cmd.dontAddCommandList) {
            const cat = (cmd.category || 'misc');
            if (!categorized[cat]) categorized[cat] = [];
            categorized[cat].push(cmd.pattern);
        }
    });
    const sortedCategories = Object.keys(categorized).sort((a, b) => a.localeCompare(b));
    for (const cat of sortedCategories) categorized[cat].sort();

    for (const category of sortedCategories) {
        const icon = getCategoryIcon(category.toUpperCase());
        categoryList += `❏ *${icon} ${category.toUpperCase()}*\n`;
        const cmds = categorized[category].map(cmd => `\`${prefix}${cmd}\``).join('  ');
        categoryList += `${cmds}\n\n`;
    }

    const menuButtons = buildButtons([
        [
            urlButton('🌐 HUNTER MD', 'https://wa.me/254701082940'),
            urlButton('👑 Owner', 'https://wa.me/254701082940')
        ],
        [urlButton('💬 Contact Owner', 'https://wa.me/254701082940')]
    ]);

    try {
        await Hunter.sendPhoto(conText.chatId, config.url, {
            caption: header,
            parse_mode: 'Markdown',
            reply_to_message_id: msg.message_id
        });
        await Hunter.sendMessage(conText.chatId, categoryList.trim(), {
            parse_mode: 'Markdown',
            reply_markup: menuButtons
        });
    } catch (err) {
        await Hunter.sendMessage(conText.chatId, header + '\n\n' + categoryList.trim(), {
            parse_mode: 'Markdown',
            reply_to_message_id: msg.message_id,
            reply_markup: menuButtons
        });
    }
});

gmd({
    pattern: "list",
    aliases: ["listmenu"],
    react: "👀",
    category: "general",
    description: "Show all commands with descriptions",
    cooldown: 5
},

async (msg, Hunter, conText) => {
    const { pushName, botName, prefix } = conText;
    const uptime = formatUptime(process.uptime());
    const totalCommands = commands.filter(c => c.pattern && !c.dontAddCommandList).length;
    const user = msg.from.username ? `@${msg.from.username}` : (pushName || 'User');

    let header = `📋 *COMMAND LIST — ${monospace(botName)}*\n`;
    header += `━━━━━━━━━━━━━━━━━━\n`;
    header += `👤 *User* › ${user}  |  👑 *Owner* › @${config.ownerUsername}\n`;
    header += `⏳ *Uptime* › ${uptime}  |  🧩 *Total* › ${totalCommands}\n`;
    header += `━━━━━━━━━━━━━━━━━━`;

    let listBody = '\n\n';
    let count = 1;
    commands.forEach(cmd => {
        if (cmd.pattern && cmd.description && !cmd.dontAddCommandList) {
            listBody += `*${count}.* \`${prefix}${cmd.pattern}\`\n`;
            listBody += `    ↳ ${cmd.description}\n\n`;
            count++;
        }
    });

    const menuButtons = buildButtons([
        [
            urlButton('🌐 HUNTER MD', 'https://wa.me/254701082940'),
            urlButton('👑 Owner', 'https://wa.me/254701082940')
        ],
        [urlButton('💬 Contact Owner', 'https://wa.me/254701082940')]
    ]);

    try {
        await Hunter.sendPhoto(conText.chatId, config.url, {
            caption: header,
            parse_mode: 'Markdown',
            reply_to_message_id: msg.message_id
        });
        await Hunter.sendMessage(conText.chatId, listBody.trim(), {
            parse_mode: 'Markdown',
            reply_markup: menuButtons
        });
    } catch (err) {
        await Hunter.sendMessage(conText.chatId, header + '\n\n' + listBody.trim(), {
            parse_mode: 'Markdown',
            reply_to_message_id: msg.message_id,
            reply_markup: menuButtons
        });
    }
});
