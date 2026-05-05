const { gmd } = require('../hunt');

gmd({
    pattern: "chatid",
    aliases: ["id", "userid", "getid", "myid", "groupid"],
    react: "🤓",
    category: "utility",
    description: "Get chat ID",
    cooldown: 5
},

async (msg, Hunter, conText) => {
    const { reply, isGroup, isChannel, isPrivate } = conText;

    const chatType = isPrivate ? '💬 Private Chat'
                   : isGroup ? '👥 Group'
                   : isChannel ? '📢 Channel'
                   : '❓ Unknown';

    const chatTitle = msg.chat.title || 'Private Chat';
    const userId = msg.from.id;
    const username = msg.from.username ? `@${msg.from.username}` : msg.from.first_name;

    await reply(
        `🆔 *Chat Info*\n` +
        `━━━━━━━━━━━━━━━━\n` +
        `📋 *Type:* ${chatType}\n` +
        `🏷 *Name:* ${chatTitle}\n` +
        `🔢 *Chat ID:* \`${conText.chatId}\`\n` +
        `👤 *Your ID:* \`${userId}\`\n` +
        `📛 *Username:* ${username}\n` +
        `━━━━━━━━━━━━━━━━`,
        { parse_mode: 'Markdown' }
    );
});


gmd({
    pattern: "chunk",
    aliases: ["details", "det", "ret"],
    react: "🤔",
    category: "utility",
    description: "Displays raw quoted message in JSON format",
    owneronly: true,
    cooldown: 10
},

async (msg, Hunter, conText) => {
    const { reply, messageReply } = conText;

    if (!messageReply) {
        return await reply(
            `🔎 *Message Inspector*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `❌ Reply to a message to inspect its raw data.\n` +
            `━━━━━━━━━━━━━━━━`
        );
    }

    try {
        const json = JSON.stringify(messageReply, null, 2);
        const chunks = json.match(/[\s\S]{1,4000}/g) || [];

        for (const chunk of chunks) {
            await reply("```json\n" + chunk + "\n```", { parse_mode: 'Markdown' });
        }
    } catch (err) {
        await reply(`❌ *Inspect Error*\n_${err.message}_`);
    }
});
