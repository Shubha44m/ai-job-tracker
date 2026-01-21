
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: path.join(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;
console.log("API Key found:", !!apiKey);

const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({ model: "models/gemini-pro-latest" });

(async () => {
    try {
        console.log("Sending request...");
        const result = await model.generateContent("Hello, are you there?");
        const response = await result.response;
        console.log("Response:", response.text());
    } catch (e) {
        console.log("ERROR OCCURRED:");
        console.dir(e, { depth: null });
    }
})();
