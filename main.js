const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { getBaapReply } = require('./Ai');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('ready', () => {
    console.log('Client is ready!');
});
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});


const MSGTEMPLATE = `
Baap thoughts on this:

--------------------------

${'${prompt}'}

--------------------------
`;

async function handleIncomingMessage(msg) {
    if (msg.type !== 'chat') return;

    console.log(`Message from ${msg.from}: ${msg.body}`);

    if (/^@baapai$/i.test(msg.body.trim().split(' ')[0]) || /^@baapai$/i.test(msg.body.trim().split(' ')[0])) {
        console.log("replying...");

        // Remove the tag (case-insensitive)
        const prompt = msg.body.replace(/@baapai/i, '').trim();

        // Get AI reply
        const baapReply = await getBaapReply(prompt);

        // Remove any HTML-like tags such as <think>, <action>, etc.
        const cleanReply = baapReply.replace(/<[^>]+>/g, '').trim();

        // Apply template
        const replyText = MSGTEMPLATE.replace("${prompt}", cleanReply);

        msg.reply(replyText);
    }
}


client.on('message_create', async (msg) => {
    await handleIncomingMessage(msg);
});

client.initialize();

