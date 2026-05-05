const { gmd } = require("../hunt");
const config = require('../config');
const { axios } = require("../hunt/gmdHelpers");

gmd(
    {
        pattern: "gpt",
        aliases: ["ai", "ask"],
        react: "🤔",
        category: "ai",
        description: "Ask questions to AI",
        cooldown: 5,
    },

    async (msg, Hunter, conText) => {
        const { reply, q, prefix } = conText;

        if (!q) {
            return await reply(
                `❓ *No query provided!*\n\n` +
                `━━━━━━━━━━━━━━━━\n` +
                `*Usage:* \`${prefix}gpt <your question>\`\n` +
                `*Example:* \`${prefix}gpt What is JavaScript?\`\n` +
                `━━━━━━━━━━━━━━━━`
            );
        }

        try {
            await Hunter.sendChatAction(conText.chatId, "typing");

            const api = `${config.apiUrl}/api/ai/ai?apikey=${config.apiKey}&q=${encodeURIComponent(q)}`;
            const response = await axios.get(api, { timeout: 30000 });
            const data = response.data;

            if (data.status && data.result) {
                const out =
                    `🤖 *AI Response*\n` +
                    `━━━━━━━━━━━━━━━━\n` +
                    `*Q:* ${q}\n\n` +
                    `*A:* ${data.result}\n` +
                    `━━━━━━━━━━━━━━━━\n` +
                    `_Powered by Hunter MD_`;
                await reply(out, { parse_mode: 'Markdown' });
            } else {
                await reply(`⚠️ *No response from AI service.*\n_Please try again later._`);
            }
        } catch (error) {
            await reply(`❌ *AI Error*\n_Could not get a response. Try again later._`);
        }
    },
);
