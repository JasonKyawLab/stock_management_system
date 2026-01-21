import { env } from '../config/env.js';

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";




export async function generateInsight(prompt) {
    
    if (!env.geminiApiKey){
        throw new Error(" GEMININ API KEY is missing! ");
    }

    const response = await fetch(
        `${GEMINI_API_URL}?key=${env.geminiApiKey}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            })
        }
    );

    if (!response.ok){
        const errorText = await response.text();
        throw new Error( `Gemini API error: ${errorText}`);
    }

    const data = await response.json();

    return(
           data.candidates?.[0]?.content?.parts?.[0]?.text ||
    "No insight generated"
    );
}