const config = require('../config');
const { commands } = require('./gmdCmds');
const { gmdLogger, isUserAdmin } = require('./gmdFunctions');
const { react } = require('./gmdUtils');

let adminOnlyMode = false;
const cooldowns = new Map();

async function executeCommand(Hunter, command, msg, match) {
    try {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const args = match[1] ? match[1].trim().split(/\s+/) : [];
        const messageReply = msg.reply_to_message;

        const isAdmin = await isUserAdmin(Hunter, chatId, userId);
        const isBotAdmin = userId.toString() === config.owner_id.toString();
        const chatType = msg.chat.type;
        const isGroup = chatType === 'group' || chatType === 'supergroup';
        const isChannel = chatType === 'channel';
        const isPrivate = chatType === 'private';

        if (adminOnlyMode && !isBotAdmin) {
            return Hunter.sendMessage(chatId, `🔒 *Bot Locked*\n━━━━━━━━━━━━━━━━\n_Only the bot admin can use commands right now._`, { parse_mode: "Markdown" });
        }

        if ((command.role === 2 || command.owneronly) && !isBotAdmin) {
            return Hunter.sendMessage(chatId, `👑 *Owner Only*\n━━━━━━━━━━━━━━━━\n_This command is restricted to the bot owner._`, { parse_mode: "Markdown" });
        }

        if ((command.role === 1 || command.adminonly) && !isBotAdmin && !isAdmin) {
            return Hunter.sendMessage(chatId, `🛡 *Admin Only*\n━━━━━━━━━━━━━━━━\n_This command is restricted to group admins._`, { parse_mode: "Markdown" });
        }

        if (command.grouponly && !isGroup) {
            return Hunter.sendMessage(chatId, `👥 *Groups Only*\n━━━━━━━━━━━━━━━━\n_This command can only be used inside groups._`, { parse_mode: "Markdown" });
        }

        if (command.channelonly && !isChannel) {
            return Hunter.sendMessage(chatId, `📢 *Channels Only*\n━━━━━━━━━━━━━━━━\n_This command can only be used in channels._`, { parse_mode: "Markdown" });
        }

        const cooldownKey = `${command.pattern}-${userId}`;
        const now = Date.now();
        if (cooldowns.has(cooldownKey)) {
            const lastUsed = cooldowns.get(cooldownKey);
            const cooldownAmount = (command.cooldown || 0) * 1000;
            if (now < lastUsed + cooldownAmount) {
                const timeLeft = Math.ceil((lastUsed + cooldownAmount - now) / 1000);
                return Hunter.sendMessage(chatId, `⏳ *Cooldown Active*\n━━━━━━━━━━━━━━━━\n_Wait *${timeLeft}s* before using \`${command.pattern}\` again._`, { parse_mode: 'Markdown' });
            }
        }
        cooldowns.set(cooldownKey, now);

        if (command.react) {
            await react(Hunter, chatId, msg.message_id, command.react);
        }

        const conText = {
            reply: (text, options = {}) => {
                return Hunter.sendMessage(chatId, text, {
                    reply_to_message_id: msg.message_id,
                    ...options
                });
            },
            sendMessage: (text, options = {}) => {
                return Hunter.sendMessage(chatId, text, options);
            },
            react: (emoji) => react(Hunter, chatId, msg.message_id, emoji),
            pushName: `${msg.from.first_name}${msg.from.last_name ? ' ' + msg.from.last_name : ''}`,
            sender: msg.from.id,
            owner: config.owner_id,
            isSuperUser: isBotAdmin,
            isAdmin: isAdmin,
            isGroup: isGroup,
            isChannel: isChannel,
            isPrivate: isPrivate,
            userId: userId,
            chatId: chatId,
            q: args.join(' '),
            args: args,
            messageReply: messageReply,
            bot: Hunter,
            prefix: config.prefix,
            botName: config.botName,
            ownerName: config.ownerName,
            timezone: config.timezone,
            sourceUrl: config.sourceUrl
        };

        await command.function(msg, Hunter, conText);

    } catch (error) {
        gmdLogger.error(`Error executing command ${command.pattern}: ${error}`);
        try {
            await react(Hunter, msg.chat.id, msg.message_id, '👎');
        } catch (e) {}
        Hunter.sendMessage(msg.chat.id, `❌ *Command Error*\n━━━━━━━━━━━━━━━━\n_Something went wrong. Please try again._`, { parse_mode: 'Markdown' });
    }
}

function registerCommands(Hunter) {
    commands.forEach(command => {
        const patterns = [command.pattern, ...(command.aliases || [])];

        patterns.forEach(pattern => {
            const prefixPattern = `^${config.prefix}${pattern}\\b(.*)$`;

            Hunter.onText(new RegExp(prefixPattern, 'i'), (msg, match) => {
                executeCommand(Hunter, command, msg, match);
            });
        });
    });
    gmdLogger.success(`Successfully registered ${commands.length} commands`);
}

function setupHandlers(Hunter) {
    const { handleAntiLink, handleNewMemberWelcome } = require('./gmdFunctions');

    Hunter.on('message', async (msg) => {
        gmdLogger.logMessage(msg);

        if (config.antiLink && config.antiLink.enabled) {
            await handleAntiLink(Hunter, msg);
        }
    });

    Hunter.on('new_chat_members', (msg) => {
        gmdLogger.logEvent('new_member', `New member joined ${msg.chat.title}`);
        handleNewMemberWelcome(Hunter, msg);
    });

    Hunter.on('left_chat_member', (msg) => {
        gmdLogger.logEvent('member_left', `Member left ${msg.chat.title}`);
    });

    Hunter.on('callback_query', async (callbackQuery) => {
        const chatId = callbackQuery.message.chat.id;
        const userId = callbackQuery.from.id;
        try {
            const data = JSON.parse(callbackQuery.data);
            const commandName = data.command;
            const command = commands.find(cmd => cmd.pattern === commandName);
            if (command && command.onReply) {
                command.onReply(Hunter, chatId, userId, data);
            }
        } catch (error) {
            gmdLogger.error('Error handling callback query:', error);
        }
    });

    Hunter.on('polling_error', (error) => {
        const code = error.code || '';
        const msg = error.message || '';

        if (code === 'ETELEGRAM' && msg.includes('409')) {
            gmdLogger.error('Polling conflict: another instance is running. Restarting polling...');
            Hunter.stopPolling().then(() => {
                setTimeout(() => Hunter.startPolling(), 5000);
            });
            return;
        }

        if (code === 'EFATAL') {
            gmdLogger.error(`Fatal polling error: ${msg}. Restarting in 10s...`);
            Hunter.stopPolling().then(() => {
                setTimeout(() => Hunter.startPolling(), 10000);
            }).catch(() => {
                setTimeout(() => Hunter.startPolling(), 10000);
            });
            return;
        }

        if (code === 'ETELEGRAM') {
            gmdLogger.error(`Telegram error: ${msg}`);
            return;
        }

        if (msg.includes('ECONNRESET') || msg.includes('ECONNREFUSED') || msg.includes('ETIMEDOUT') || msg.includes('EAI_AGAIN')) {
            gmdLogger.warning(`Network issue: ${msg}. Retrying...`);
            return;
        }

        gmdLogger.error(`Polling error: ${msg}`);
    });

    Hunter.on('polling_started', () => {
        gmdLogger.event('Bot polling started');
    });
}

function setAdminOnly(value) {
    adminOnlyMode = value;
}

function getAdminOnly() {
    return adminOnlyMode;
}

module.exports = {
    executeCommand,
    registerCommands,
    setupHandlers,
    setAdminOnly,
    getAdminOnly
};
