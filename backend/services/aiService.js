const Groq = require("groq-sdk");

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

/**
 * Summarize a post using Groq API with automatic model fallback
 * Groq will automatically select the best available model
 * @param {string} title - Post title
 * @param {string} body - Post content/body
 * @returns {Promise<string>} - AI-generated summary
 */
const summarizePost = async (title, body) => {
    if (!process.env.GROQ_API_KEY) {
        console.error("GROQ_API_KEY is not configured");
        throw createError("Groq API key is not configured", 500);
    }

    if (!title && !body) {
        throw createError("Post must have a title or body to summarize", 400);
    }

    // List of Groq models to try, in order of preference
    const modelsToTry = [
        "llama-3.3-70b-versatile",   // Latest and most capable
        "llama-3.1-70b-versatile",   // Fallback
        "llama-3.1-8b-instant",      // Lightweight option
    ];

    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`Attempting to use model: ${modelName}`);
            const groq = new Groq({
                apiKey: process.env.GROQ_API_KEY,
            });

            const content = `Title: ${title}\n\nContent: ${body}`;
            
            const prompt = `You are a helpful assistant that summarizes Reddit posts concisely. Provide a clear, brief summary in 2-3 sentences. Be objective and capture the main idea.\n\nPlease summarize this post:\n\n${content}`;

            console.log("Sending request to Groq API...");
            
            const message = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                model: modelName,
                max_tokens: 256,
                temperature: 0.7,
            });

            const summary = message.choices[0]?.message?.content?.trim();
            
            if (!summary) {
                throw createError("Failed to generate summary", 500);
            }

            console.log(`✓ Summary generated successfully with model: ${modelName}`);
            return summary;
        } catch (error) {
            console.error(`Model ${modelName} failed:`, error.message);
            lastError = error;
            
            const errorMessage = error.message || "";
            
            // If it's a model not found/decommissioned error, try next model
            if (errorMessage.includes("decommissioned") || errorMessage.includes("not found") || errorMessage.includes("not exist")) {
                console.log(`Model ${modelName} not available, trying next...`);
                continue;
            }
            
            // If it's a model not found error on the first try, continue
            if (modelName === modelsToTry[0]) {
                continue;
            }
            
            // For rate limit on first model, try next
            if (errorMessage.includes("rate limit") || errorMessage.includes("429")) {
                console.log(`Rate limit on ${modelName}, trying next...`);
                continue;
            }
        }
    }

    // If all models failed
    if (lastError) {
        const errorMessage = lastError.message || "";
        
        if (errorMessage.includes("API Key") || errorMessage.includes("authentication")) {
            throw createError("Invalid Groq API key. Please check your API key.", 401);
        }
        if (errorMessage.includes("rate limit") || errorMessage.includes("429")) {
            throw createError("Rate limited. Please try again in a few moments.", 429);
        }
        if (errorMessage.includes("quota")) {
            throw createError("Quota exceeded. Please try again later.", 429);
        }
        
        if (lastError.statusCode) {
            throw lastError;
        }
        
        throw createError(`AI Service Error: ${errorMessage}`, 500);
    }

    throw createError("No available models could be reached", 500);
};

module.exports = {
    summarizePost,
};
