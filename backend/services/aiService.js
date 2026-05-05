const { GoogleGenerativeAI } = require("@google/generative-ai");

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

/**
 * Summarize a post using Google Gemini API
 * @param {string} title - Post title
 * @param {string} body - Post content/body
 * @returns {Promise<string>} - AI-generated summary
 */
const summarizePost = async (title, body) => {
    if (!process.env.GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not configured");
        throw createError("Gemini API key is not configured", 500);
    }

    if (!title && !body) {
        throw createError("Post must have a title or body to summarize", 400);
    }

    try {
        // Initialize GenAI with API key each time to ensure fresh connection
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Use gemini-2.0-flash which is stable and widely available
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const content = `Title: ${title}\n\nContent: ${body}`;
        
        const prompt = `You are a helpful assistant that summarizes Reddit posts concisely. Provide a clear, brief summary in 2-3 sentences. Be objective and capture the main idea.

Please summarize this post:

${content}`;

        console.log("Sending request to Gemini API...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text().trim();
        
        if (!summary) {
            throw createError("Failed to generate summary", 500);
        }

        console.log("Summary generated successfully");
        return summary;
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        
        // Handle Gemini API errors with better detection
        const errorMessage = error.message || "";
        
        if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("invalid API key")) {
            throw createError("Invalid Gemini API key. Please check your API key.", 401);
        }
        if (errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("quota")) {
            throw createError("Gemini API quota exhausted. Please try again later.", 429);
        }
        if (errorMessage.includes("429") || errorMessage.includes("rate")) {
            throw createError("Too many requests. Please wait a moment and try again.", 429);
        }
        if (errorMessage.includes("PERMISSION_DENIED")) {
            throw createError("Permission denied. Your API key may not have access to Gemini API.", 403);
        }
        
        // If it's already our error, pass it through
        if (error.statusCode) {
            throw error;
        }
        
        throw createError(`AI Service Error: ${errorMessage}`, 500);
    }
};

module.exports = {
    summarizePost,
};
