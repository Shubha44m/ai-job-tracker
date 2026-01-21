
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config({ path: path.join(__dirname, '../.env') });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

(async () => {
    try {
        console.log("Fetching available models...");
        // Note: The Node SDK might not expose listModels directly on genAI instance in all versions,
        // but let's try the direct model access first or just try a standard list if possible.
        // Actually, for the current SDK version, we simply try to generate with a few known candidates 
        // to see which one DOESN'T throw 404.

        const candidates = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];

        for (const modelName of candidates) {
            console.log(`\nTesting model: ${modelName}`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Test.");
                const response = await result.response;
                console.log(`✅ SUCCESS: ${modelName} is working!`);
                console.log(`Response: ${response.text()}`);
                break; // Stop after finding one that works
            } catch (error: any) {
                console.log(`❌ FAILED: ${modelName}`);
                if (error.status) console.log(`Status: ${error.status} ${error.statusText}`);
                else console.log(error.message);
            }
        }

    } catch (e) {
        console.error(e);
    }
})();
