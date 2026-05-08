const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

async function listAvailableModels() {
    console.log("Fetching available Gemini models...");
    
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const models = await genAI.listModels();
        
        console.log("Available Models:");
        models.models.forEach(model => {
            console.log(`  - ${model.name}`);
        });
    } catch (error) {
        console.error("Error:", error.message);
    }
}

listAvailableModels();
