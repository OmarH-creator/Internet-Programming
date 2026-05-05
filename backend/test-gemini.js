const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

async function testGeminiAPI() {
    console.log("Testing Gemini API Key...");
    console.log("API Key:", process.env.GEMINI_API_KEY ? "✓ Loaded" : "✗ Not found");
    
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        console.log("\nSending test request to Gemini API...");
        const result = await model.generateContent("Summarize this in one sentence: The Earth is a planet in our solar system.");
        const response = await result.response;
        const text = response.text();
        
        console.log("✓ API Test Successful!");
        console.log("Response:", text);
    } catch (error) {
        console.error("✗ API Test Failed!");
        console.error("Error:", error.message);
        process.exit(1);
    }
}

testGeminiAPI();
