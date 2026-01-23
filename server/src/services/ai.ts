import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
// Use 1.5-flash for higher rate limits (15 RPM free tier)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface MatchResult {
    score: number;
    match_level: 'High' | 'Medium' | 'Low';
    reasons: string[];
}

/**
 * Basic keyword match fallback when AI is unavailable
 */
const calculateKeywordMatch = (resumeText: string, job: any): MatchResult => {
    const resume = resumeText.toLowerCase();
    const jobContent = `${job.title} ${job.description} ${job.skills?.join(' ')}`.toLowerCase();

    // Core technical keywords to check
    const baseKeywords = job.skills || ['react', 'node', 'python', 'javascript', 'typescript', 'sql', 'aws', 'docker'];
    // Also include words from the job title (e.g. "Frontend", "Senior")
    const titleKeywords = job.title.split(/[\s()/]+/).filter((w: string) => w.length > 2);
    const keywords = [...new Set([...baseKeywords, ...titleKeywords])];

    const matched = keywords.filter((k: string) => resume.includes(k.toLowerCase()));

    const score = Math.min(Math.round((matched.length / keywords.length) * 100), 100);

    let match_level: 'High' | 'Medium' | 'Low' = 'Low';
    if (score > 70) match_level = 'High';
    else if (score > 40) match_level = 'Medium';

    return {
        score,
        match_level,
        reasons: [
            `Matched ${matched.length} key skills from the job description.`,
            `Keywords found: ${matched.slice(0, 3).join(', ')}...`,
            "Note: This is a keyword-based match as the AI service is currently at capacity."
        ]
    };
};

export const scoreJobFormatted = async (resumeText: string, job: any): Promise<MatchResult> => {
    try {
        const prompt = `
        Role: You are an expert ATS (Applicant Tracking System) and Technical Recruiter.
        Task: Evaluate the match between the provided Resume Content and the Job Description.

        Resume Content:
        ${resumeText.slice(0, 6000)} ...

        Job Description:
        Title: ${job.title}
        Description: ${job.description}
        Skills: ${job.skills ? job.skills.join(', ') : 'N/A'}

        Output Format: Provide the response STRICTLY as a JSON object with the following structure, and NO other text:
        {
          "score": number, // 0 to 100
          "match_level": "High" | "Medium" | "Low",
          "reasons": string[] // Array of 3-4 specific reasons.
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const json: MatchResult = JSON.parse(text);

        return {
            score: typeof json.score === 'number' ? json.score : 50,
            match_level: ['High', 'Medium', 'Low'].includes(json.match_level) ? json.match_level : 'Medium',
            reasons: Array.isArray(json.reasons) ? json.reasons : ['Analysis completed successfully.']
        };

    } catch (error: any) {
        console.warn("Gemini Scoring Failed (Fallback engaged):", error.message);
        // Fallback to keyword matching if AI fails (e.g. 429 error)
        return calculateKeywordMatch(resumeText, job);
    }
};

export const chatWithAI = async (message: string, context: { jobs: any[], applications: any[] }) => {
    try {
        const { jobs, applications } = context;
        const jobsContext = jobs.slice(0, 20).map(j =>
            `- ${j.title} at ${j.company} (ID: ${j.id})`
        ).join('\n');

        const appContext = applications.length > 0
            ? `Applied to: ${applications.map(a => a.jobId).join(', ')}`
            : "No applications yet.";

        const prompt = `
        System: You are Anti-Gravity, a helpful career assistant. 
        Context:
        ${jobsContext}
        ${appContext}

        Question: "${message}"
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();

    } catch (error: any) {
        if (error.message?.includes('429')) {
            return "I'm currently receiving too many requests. Please give me a moment to breathe and ask again!";
        }
        return `I'm having trouble connecting to my brain. Error: ${error.message || 'Unknown'}`;
    }
};
