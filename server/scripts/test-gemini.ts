
import dotenv from 'dotenv';
import path from 'path';

// Point to the .env in the parent directory (server/)
dotenv.config({ path: path.join(__dirname, '../.env') });

import { scoreJobFormatted, chatWithAI } from '../src/services/ai';

(async () => {
    console.log("Testing Gemini Integration...");

    const mockResume = "I am a Senior React Engineer with 5 years of experience in Typescript, Node.js, and AWS.";
    const mockJob = {
        title: "Senior Frontend Developer",
        company: "Tech Corp",
        description: "Looking for a React expert with Typescript experience.",
        skills: ["React", "Typescript", "Redux"]
    };

    console.log("\n1. Testing Job Scoring...");
    const scoreResult = await scoreJobFormatted(mockResume, mockJob);
    console.log("Score Result:", JSON.stringify(scoreResult, null, 2));

    console.log("\n2. Testing Chat...");
    const chatResult = await chatWithAI("Find me a React job", {
        jobs: [mockJob],
        applications: []
    });
    console.log("Chat Result:", chatResult);

})();
