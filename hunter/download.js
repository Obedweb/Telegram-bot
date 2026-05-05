const { gmd } = require('../hunt');
const config = require('../config');
const { AUDIO_APIS, VIDEO_APIS, tryDownloadWithFallback, formatDuration, formatViews, cleanupFile, fs, searchHunterTechYts } = require('../hunt/gmdHelpers');
const axios = require('axios');


gmd({
    pattern: "play",
    aliases: ["song", "music"],
    react: "🎉",
    category: "download",
    description: "Download audio from YouTube",
    cooldown: 10
},

async (msg, Hunter, conText) => {
    const { reply, q, prefix } = conText;

    if (!q) {
        return await reply(
            `🎵 *Audio Downloader*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `*Usage:* \`${prefix}play <song name or URL>\`\n` +
            `*Example:* \`${prefix}play Spectre Alan Walker\`\n` +
            `━━━━━━━━━━━━━━━━`
        );
    }

    let tempFilePath = null;

    try {
        await Hunter.sendChatAction(conText.chatId, 'typing');
        const videos = await searchHunterTechYts(q);

        if (!videos || videos.length === 0) {
            return await reply(`🔍 *No results found* for: _${q}_\n_Try a different search term._`);
        }

        const video = videos[0];
        await reply(
            `🎯 *Found!*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `🎵 *${video.name}*\n` +
            `⏱ Duration: ${video.duration || 'Unknown'}\n` +
            `📥 Downloading audio...\n` +
            `━━━━━━━━━━━━━━━━`
        );
        await Hunter.sendChatAction(conText.chatId, 'upload_audio');

        const result = await tryDownloadWithFallback(AUDIO_APIS, video.url, 'audio');

        if (!result) {
            return await reply(`❌ *Download Failed*\n_All sources failed. Try again later._`);
        }

        tempFilePath = result.filePath;
        const fileName = result.data.result.title || video.name;
        const duration = result.data.result.duration || video.duration || '0:00';
        const views = video.views || 0;

        const caption =
            `🎵 *${fileName.replace('.mp3', '')}*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `⏱ *Duration:* ${formatDuration(duration)}\n` +
            `👁 *Views:* ${formatViews(views)}\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `_via Hunter MD_`;

        const stream = fs.createReadStream(tempFilePath);
        await Hunter.sendAudio(conText.chatId, stream, {
            title: fileName.replace('.mp3', ''),
            performer: config.artistName,
            caption,
            parse_mode: 'Markdown'
        }, {
            filename: `${fileName.replace('.mp3', '')}.mp3`,
            contentType: 'audio/mpeg'
        });

    } catch (error) {
        await reply(`❌ *Audio Download Error*\n_${error.message}_`);
    } finally {
        cleanupFile(tempFilePath);
    }
});

gmd({
    pattern: "video",
    react: "🔥",
    category: "download",
    description: "Download video from YouTube",
    cooldown: 10
},

async (msg, Hunter, conText) => {
    const { reply, q, prefix } = conText;

    if (!q) {
        return await reply(
            `🎬 *Video Downloader*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `*Usage:* \`${prefix}video <video name or URL>\`\n` +
            `*Example:* \`${prefix}video Spectre Alan Walker\`\n` +
            `━━━━━━━━━━━━━━━━`
        );
    }

    let tempFilePath = null;

    try {
        await Hunter.sendChatAction(conText.chatId, 'typing');
        const videos = await searchHunterTechYts(q);

        if (!videos || videos.length === 0) {
            return await reply(`🔍 *No results found* for: _${q}_\n_Try a different search term._`);
        }

        const video = videos[0];
        await reply(
            `🎯 *Found!*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `🎬 *${video.name}*\n` +
            `⏱ Duration: ${video.duration || 'Unknown'}\n` +
            `📥 Downloading video...\n` +
            `━━━━━━━━━━━━━━━━`
        );
        await Hunter.sendChatAction(conText.chatId, 'upload_video');

        const result = await tryDownloadWithFallback(VIDEO_APIS, video.url, 'video');

        if (!result) {
            return await reply(`❌ *Download Failed*\n_All sources failed. Try again later._`);
        }

        tempFilePath = result.filePath;
        const fileName = result.data.result.title || video.name;
        const duration = result.data.result.duration || video.duration || '0:00';
        const views = video.views || 0;

        const caption =
            `🎬 *${fileName.replace('.mp4', '')}*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `⏱ *Duration:* ${formatDuration(duration)}\n` +
            `👁 *Views:* ${formatViews(views)}\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `_via Hunter MD_`;

        const stream = fs.createReadStream(tempFilePath);
        await Hunter.sendVideo(conText.chatId, stream, {
            caption,
            parse_mode: 'Markdown'
        }, {
            filename: `${fileName.replace('.mp4', '')}.mp4`,
            contentType: 'video/mp4'
        });

    } catch (error) {
        await reply(`❌ *Video Download Error*\n_${error.message}_`);
    } finally {
        cleanupFile(tempFilePath);
    }
});


gmd({
    pattern: "yts",
    react: "🔍",
    category: "search",
    description: "Search YouTube videos",
    cooldown: 5
},

async (msg, Hunter, conText) => {
    const { reply, q, prefix } = conText;

    if (!q) {
        return await reply(
            `🔍 *YouTube Search*\n` +
            `━━━━━━━━━━━━━━━━\n` +
            `*Usage:* \`${prefix}yts <search query>\`\n` +
            `*Example:* \`${prefix}yts Spectre Alan Walker\`\n` +
            `━━━━━━━━━━━━━━━━`
        );
    }

    try {
        await Hunter.sendChatAction(conText.chatId, 'typing');
        const videos = await searchHunterTechYts(q);

        if (!videos || videos.length === 0) {
            return await reply(`🔍 *No results found* for: _${q}_`);
        }

        let out = `🔍 *YouTube Results*\n`;
        out += `━━━━━━━━━━━━━━━━\n`;
        out += `*Query:* ${q}\n\n`;

        videos.slice(0, 5).forEach((video, i) => {
            out += `*${i + 1}.* 🎬 *${video.name}*\n`;
            out += `   ⏱ ${video.duration || 'Unknown'}  👁 ${formatViews(video.views || 0)}\n`;
            out += `   📺 ${video.author || 'Unknown'}\n\n`;
        });

        out += `━━━━━━━━━━━━━━━━\n`;
        out += `_Use \`${prefix}play\` or \`${prefix}video\` to download_`;

        await reply(out, { parse_mode: 'Markdown' });

    } catch (error) {
        await reply(`❌ *Search Error*\n_${error.message}_`);
    }
});
