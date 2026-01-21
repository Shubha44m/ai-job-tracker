import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "models/gemini-pro-latest" });

export interface MatchResult {
    score: number;
    match_level: 'High' | 'Medium' | 'Low';
    reasons: string[];
}

export const scoreJobFormatted = async (resumeText: string, job: any): Promise<MatchResult> => {
    try {
        const prompt = `
        Role: You are an expert ATS (Applicant Tracking System) and Technical Recruiter.
        Task: Evaluate the match between the provided Resume Content and the Job Description.

        Resume Content:
        ${resumeText.slice(0, 4000)} ... (truncated if too long)

        Job Description:
        Title: ${job.title}
        Company: ${job.company}
        Description: ${job.description}
        Skills: ${job.skills ? job.skills.join(', ') : 'N/A'}

        Output Format: Provide the response STRICTLY as a JSON object with the following structure, and NO other text:
        {
          "score": number, // 0 to 100
          "match_level": "High" | "Medium" | "Low",
          "reasons": string[] // Array of 3-4 specific reasons describing the fit or gap.
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const json: MatchResult = JSON.parse(text);

        // Safety validation
        return {
            score: typeof json.score === 'number' ? json.score : 50,
            match_level: ['High', 'Medium', 'Low'].includes(json.match_level) ? json.match_level : 'Medium',
            reasons: Array.isArray(json.reasons) ? json.reasons : ['Analysis failed to parse reasons.']
        };

    } catch (error) {
        console.error("Gemini Scoring Error:", error);
        // Fallback or Error handling
        return {
            score: 0,
            match_level: 'Low',
            reasons: ["AI Service is currently unavailable. Please try again later.", String(error)]
        };
    }
};

export const chatWithAI = async (message: string, context: { jobs: any[], applications: any[] }) => {
    try {
        const { jobs, applications } = context;

        // Prepare context summary for the LLM
        const jobsContext = jobs.slice(0, 20).map(j =>
            `- ${j.title} at ${j.company} (ID: ${j.id}, Location: ${j.location})`
        ).join('\n');

        const appContext = applications.length > 0
            ? `User has applied to: ${applications.map(a => a.jobId).join(', ')}`
            : "User has not applied to any jobs yet.";

        const prompt = `
        System: You are Anti-Gravity, an intelligent job matching assistant.
        Refuse to answer questions unrelated to jobs, career, or the application.
        
        Current Data Context:
        - Available Jobs (top 20):
        ${jobsContext}
        
        - User Application Status:
        ${appContext}

        User Question: "${message}"

        Response Guidelines:
        - Be helpful, encouraging, and concise.
        - If suggesting a job, MUST mention the exact Company Name and Title.
        - Keep response under 3 sentences unless detailed comparison is asked.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error: any) {
        console.error("Gemini Chat Error Details:", error);
        return `I'm currently offline. Error: ${error.message || 'Connection failed'}`;
    }
};
