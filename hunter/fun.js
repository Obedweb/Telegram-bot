const { gmd } = require('../hunt');
const { axios } = require('../hunt/gmdHelpers');

let callbackSetup = false;

function setupCallbackHandler(Hunter) {
    Hunter.on('callback_query', async (callbackQuery) => {
        try {
            const data = JSON.parse(callbackQuery.data);
            if (data.command === 'quote') {
                await handleQuoteCallback(callbackQuery, Hunter);
            }
        } catch (error) {
            console.error('Quote callback error:', error);
        }
    });
}

async function handleQuoteCallback(callbackQuery, Hunter) {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;

    try {
        await Hunter.answerCallbackQuery(callbackQuery.id, { text: '🔄 Loading new quote...' });
        await Hunter.sendChatAction(chatId, 'upload_audio');

        const response = await axios.get('https://apiskeith.top/quote/audio');
        const quoteData = response.data;

        if (quoteData.status && quoteData.result && quoteData.result.mp3) {
            const audioUrl = quoteData.result.mp3;
            const quotes = quoteData.result.data.filter(item => item.type === 'quote');
            const quoteText = quotes.map(q => q.text).join('\n\n');

            const buttons = { inline_keyboard: [[{ text: '🔁 Next Quote', callback_data: JSON.stringify({ command: 'quote', action: 'more' }) }]] };

            await Hunter.sendAudio(chatId, audioUrl, {
                caption:
                    `💭 *Random Quote*\n` +
                    `━━━━━━━━━━━━━━━━\n` +
                    `${quoteText}\n` +
                    `━━━━━━━━━━━━━━━━\n` +
                    `_via Hunter MD_`,
                parse_mode: 'Markdown',
                reply_markup: buttons
            }, { contentType: 'audio/mpeg' });

            await Hunter.deleteMessage(chatId, messageId);
        } else {
            await Hunter.answerCallbackQuery(callbackQuery.id, { text: '❌ Failed to load quote' });
        }
    } catch (error) {
        await Hunter.answerCallbackQuery(callbackQuery.id, { text: '❌ Failed to load more' });
    }
}

gmd({
    pattern: "quote",
    aliases: ["qaudio", "inspireaudio"],
    react: "❤️‍🔥",
    category: "fun",
    description: "Random quote audio",
    cooldown: 10
},

async (msg, Hunter, conText) => {
    const { reply } = conText;

    if (!callbackSetup) {
        setupCallbackHandler(Hunter);
        callbackSetup = true;
    }

    try {
        await Hunter.sendChatAction(conText.chatId, 'upload_audio');
        const response = await axios.get('https://apiskeith.top/quote/audio');
        const quoteData = response.data;

        if (quoteData.status && quoteData.result && quoteData.result.mp3) {
            const audioUrl = quoteData.result.mp3;
            const quotes = quoteData.result.data.filter(item => item.type === 'quote');
            const quoteText = quotes.map(q => q.text).join('\n\n');

            const buttons = [[{ text: '🔁 Next Quote', callback_data: JSON.stringify({ command: 'quote', action: 'more' }) }]];

            await Hunter.sendAudio(conText.chatId, audioUrl, {
                caption:
                    `💭 *Random Quote*\n` +
                    `━━━━━━━━━━━━━━━━\n` +
                    `${quoteText}\n` +
                    `━━━━━━━━━━━━━━━━\n` +
                    `_via Hunter MD_`,
                parse_mode: 'Markdown',
                reply_markup: { inline_keyboard: buttons }
            }, { contentType: 'audio/mpeg' });
        } else {
            await reply(`❌ *Failed to fetch quote audio.*\n_Try again later._`);
        }
    } catch (error) {
        await reply(`❌ *Quote Error*\n_${error.message}_`);
    }
});
