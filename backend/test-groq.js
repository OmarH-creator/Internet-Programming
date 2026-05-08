const Groq = require("groq-sdk");

require("dotenv").config();

async function testGroqAPI() {
    console.log("Testing Groq API Key...");
    console.log("API Key:", process.env.GROQ_API_KEY ? "✓ Loaded" : "✗ Not found");
    
    // Try latest Groq models (as of 2025-2026)
    const modelsToTry = [
        "llama-3.3-70b-versatile",     // Primary - confirmed working
        "llama-3.1-70b-versatile",     // Fallback
        "llama-3.1-8b-instant",        // Lightweight
    ];

    for (const model of modelsToTry) {
        try {
            const groq = new Groq({
                apiKey: process.env.GROQ_API_KEY,
            });
            
            console.log(`Trying model: ${model}`);
            const message = await groq.chat.completions.create({
                messages: [
                    { role: "user", content: "Say 'Test successful' if you can read this." }
                ],
                model: model,
                max_tokens: 50,
            });
            
            const text = message.choices[0]?.message?.content;
            
            console.log("\n✓ API Test Successful!");
            console.log("Working Model:", model);
            console.log("Response:", text);
            return;
        } catch (error) {
            const msg = error.message || "";
            if (msg.includes("decommissioned")) {
                console.log(`  → Decommissioned`);
            } else if (msg.includes("not exist") || msg.includes("no access")) {
                console.log(`  → No access`);
            } else {
                console.log(`  → Error: ${msg.substring(0, 100)}`);
            }
        }
    }
    
    console.error("\n✗ No working models found!");
    console.error("Please verify your Groq API key is active and has access to models.");
}

testGroqAPI();
