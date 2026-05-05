const { gmd } = require('../hunt');
const { uploadToHunterCdn, uploadToCatbox, uploadToGithubCdn, uploadToImgBB, uploadToPixhost, downloadTgFile, isImageFile, fs, path, tempDir } = require('../hunt/gmdHelpers');

function uploadHandler(label, uploadFn, imageOnly = false) {
    return async (msg, Hunter, conText) => {
        const { reply, messageReply } = conText;

        if (!messageReply) {
            return await reply(
                `📤 *${label}*\n` +
                `━━━━━━━━━━━━━━━━\n` +
                `❌ Reply to a ${imageOnly ? 'photo/image' : 'file, photo, video or audio'} to upload.\n` +
                `━━━━━━━━━━━━━━━━`
            );
        }

        let filePath = null;
        try {
            await Hunter.sendChatAction(conText.chatId, 'upload_document');
            const file = await downloadTgFile(Hunter, messageReply);
            if (!file) return await reply(`❌ *Unsupported file type.*`);

            if (imageOnly && !isImageFile(file.fileName)) {
                return await reply(`❌ *${label} only supports images*\n_jpg, png, gif, webp, bmp_`);
            }

            filePath = file.filePath;
            const buffer = fs.readFileSync(filePath);
            const result = await uploadFn(buffer, file.fileName);

            await reply(
                `✅ *Upload Successful — ${label}*\n` +
                `━━━━━━━━━━━━━━━━\n` +
                `📎 *Link:*\n\`${result.url}\`\n` +
                `━━━━━━━━━━━━━━━━\n` +
                `_via Hunter MD_`,
                { parse_mode: 'Markdown' }
            );
        } catch (error) {
            await reply(`❌ *Upload Failed*\n_${error.message}_`);
        } finally {
            try { if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) {}
        }
    };
}

const { uploadToHunterCdn: hCdn, uploadToCatbox: catbox, uploadToGithubCdn: ghCdn, uploadToImgBB: imgbb, uploadToPixhost: pixhost } = require('../hunt/gmdHelpers');

gmd({
    pattern: "huntercdn",
    aliases: ["url", "geturl", "filelink", "cdn"],
    react: "🔥",
    category: "upload",
    description: "Upload file to HunterCDN",
    cooldown: 10
}, uploadHandler('HunterCDN', hCdn));

gmd({
    pattern: "catbox",
    react: "🔥",
    category: "upload",
    description: "Upload file to Catbox",
    cooldown: 10
}, uploadHandler('Catbox', catbox));

gmd({
    pattern: "githubcdn",
    aliases: ["ghcdn"],
    react: "🔥",
    category: "upload",
    description: "Upload file to GitHub CDN",
    cooldown: 10
}, uploadHandler('GitHub CDN', ghCdn));

gmd({
    pattern: "imgbb",
    react: "🔥",
    category: "upload",
    description: "Upload image to ImgBB",
    cooldown: 10
}, uploadHandler('ImgBB', imgbb, true));

gmd({
    pattern: "pixhost",
    react: "🔥",
    category: "upload",
    description: "Upload image to Pixhost",
    cooldown: 10
}, uploadHandler('Pixhost', pixhost, true));
