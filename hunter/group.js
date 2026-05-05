const { gmd } = require('../hunt');

gmd({
    pattern: "demote",
    aliases: ["removeadmin", "unadmin"],
    react: "😈",
    category: "group",
    description: "Demote a user from admin",
    adminonly: true,
    grouponly: true,
    cooldown: 5
},

async (msg, Hunter, conText) => {
    const { reply, messageReply } = conText;

    if (!messageReply) {
        return await reply(
            `👥 *Demote User*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `❌ *Reply to the user* you want to demote.\n` +
            `━━━━━━━━━━━━━━━━`
        );
    }

    const targetUserId = messageReply.from.id;
    const targetName = messageReply.from.first_name + (messageReply.from.last_name ? ' ' + messageReply.from.last_name : '');

    try {
        await Hunter.promoteChatMember(conText.chatId, targetUserId, {
            can_change_info: false,
            can_delete_messages: false,
            can_invite_users: false,
            can_restrict_members: false,
            can_pin_messages: false,
            can_promote_members: false,
            can_manage_chat: false,
            can_manage_video_chats: false,
            can_post_messages: false,
            can_edit_messages: false
        });

        await reply(
            `👥 *Admin Demoted*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `✅ *${targetName}* has been removed from admin.\n` +
            `━━━━━━━━━━━━━━━━`
        );
    } catch (error) {
        const code = error.response?.statusCode;
        const errMsg = code === 400 ? `I need admin permissions to demote users.`
                     : code === 403 ? `Cannot demote this user — insufficient permissions.`
                     : `Failed to demote user. Ensure I have admin rights.`;
        await reply(`❌ *Demote Failed*\n━━━━━━━━━━━━━━━━\n_${errMsg}_`);
    }
});

gmd({
    pattern: "promote",
    aliases: ["admin", "makeadmin"],
    react: "🏆",
    category: "group",
    description: "Promote a user to admin",
    adminonly: true,
    grouponly: true,
    cooldown: 5
},

async (msg, Hunter, conText) => {
    const { reply, messageReply } = conText;

    if (!messageReply) {
        return await reply(
            `👑 *Promote User*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `❌ *Reply to the user* you want to promote.\n` +
            `━━━━━━━━━━━━━━━━`
        );
    }

    const targetUserId = messageReply.from.id;
    const targetName = messageReply.from.first_name + (messageReply.from.last_name ? ' ' + messageReply.from.last_name : '');

    try {
        await Hunter.promoteChatMember(conText.chatId, targetUserId, {
            can_change_info: true,
            can_delete_messages: true,
            can_invite_users: true,
            can_restrict_members: true,
            can_pin_messages: true,
            can_promote_members: false,
            can_manage_chat: true,
            can_manage_video_chats: true
        });

        await reply(
            `👑 *Admin Promoted*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `✅ *${targetName}* is now an admin.\n` +
            `━━━━━━━━━━━━━━━━`
        );
    } catch (error) {
        const code = error.response?.statusCode;
        const errMsg = code === 400 ? `I need admin permissions to promote users.`
                     : code === 403 ? `Cannot promote this user — they may already be an admin.`
                     : `Failed to promote user. Ensure I have admin rights.`;
        await reply(`❌ *Promote Failed*\n━━━━━━━━━━━━━━━━\n_${errMsg}_`);
    }
});
