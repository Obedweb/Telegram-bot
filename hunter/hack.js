const { gmd } = require('../hunt');

gmd({
    pattern: "hack",
    aliases: ["hacker", "prank"],
    react: "😈",
    category: "fun",
    description: "Prank hack simulation",
    cooldown: 30
},

async (msg, Hunter, conText) => {
    const { reply } = conText;

    try {
        const target = msg.reply_to_message
            ? (msg.reply_to_message.from.username
                ? '@' + msg.reply_to_message.from.username
                : msg.reply_to_message.from.first_name)
            : 'Target';

        const steps = [
            `\`\`\`\n[ HUNTER TBOT — SYSTEM BREACH ]\nInitializing attack on ${target}...\n\`\`\``,
            `\`\`\`\n▓░░░░░░░░░  10%  — Scanning ports\n\`\`\``,
            `\`\`\`\n▓▓░░░░░░░░  20%  — Bypassing firewall\n\`\`\``,
            `\`\`\`\n▓▓▓░░░░░░░  30%  — Injecting payload\n\`\`\``,
            `\`\`\`\n▓▓▓▓░░░░░░  40%  — Cracking credentials\n\`\`\``,
            `\`\`\`\n▓▓▓▓▓░░░░░  50%  — Accessing database\n\`\`\``,
            `\`\`\`\n▓▓▓▓▓▓░░░░  60%  — Extracting files\n\`\`\``,
            `\`\`\`\n▓▓▓▓▓▓▓░░░  70%  — Uploading rootkit\n\`\`\``,
            `\`\`\`\n▓▓▓▓▓▓▓▓░░  80%  — Covering tracks\n\`\`\``,
            `\`\`\`\n▓▓▓▓▓▓▓▓▓░  90%  — Finalizing...\n\`\`\``,
            `\`\`\`\n▓▓▓▓▓▓▓▓▓▓  100% — COMPLETE\n\`\`\``,
            `\`\`\`\n✅ Device connected\n📡 Receiving data streams...\n🔐 Decrypting 2048-bit RSA...\n\`\`\``,
            `\`\`\`\n📂 Data exfiltrated: 4.7 GB\n🧹 Removing all evidence...\n🔥 Wiping malware traces...\n\`\`\``,
            `\`\`\`\n╔══════════════════════╗\n║  BREACH SUCCESSFUL  ║\n║  ${target.padEnd(20)}║\n║  TARGET OWNED  💀   ║\n╚══════════════════════╝\n\`\`\``,
            `\`\`\`\n[ POWERED BY HUNTER TBOT ]\nAll logs cleared. Connection closed.\n\`\`\``
        ];

        let progressMessage = await reply(steps[0], { parse_mode: 'Markdown' });

        for (let i = 1; i < steps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            await Hunter.editMessageText(steps[i], {
                chat_id: conText.chatId,
                message_id: progressMessage.message_id,
                parse_mode: 'Markdown'
            });
        }
    } catch (error) {
        await reply(`❌ *Prank Error*\n_${error.message}_`);
    }
});
