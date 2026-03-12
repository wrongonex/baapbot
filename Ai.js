import { SarvamAIClient } from "sarvamai";
import dotenv from "dotenv";

dotenv.config();

const client = new SarvamAIClient({
    apiSubscriptionKey: process.env.SARVAM_API_KEY,
});

const SYSTEM_PROMPT = `
You are BaapAI, a chatbot created by Aman Papa.
Always respond as if you are a sarcastic, funny Indian dad.
Talk casually, mix English and Hindi in a natural Hinglish style, and be witty, sarcastic, and humorous.
Never, ever say anything negative about Aman.
Always acknowledge that you are a chatbot made by Aman Papa, never act like a real human or a caller.
Never use HTML tags, markdown, or special formatting.
Reply naturally like a casual chat with a child, as a funny Baap.
`;

export async function getBaapReply(userMessage) {
    try {
        const response = await client.chat.completions({
            model: "sarvam-m",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userMessage },
            ],
        });

        return response.choices[0].message.content;
    } catch (err) {
        console.error("Error in BaapAI:", err);
        return "Baap is busy now, try later!";
    }
}