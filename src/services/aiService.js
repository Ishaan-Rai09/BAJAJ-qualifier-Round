const axios = require('axios');

/**
 * Query AI API for a single-word factual answer.
 * Uses Groq API (llama-3.3-70b-versatile model)
 * @param {string} question - Natural language question
 * @returns {Promise<string>} Single-word answer
 */
async function aiService(question) {
    const apiKey = process.env.AI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw Object.assign(
            new Error('AI_API_KEY is not configured. Set it in your .env file.'),
            { statusCode: 500 }
        );
    }

    try {
        const url = 'https://api.groq.com/openai/v1/chat/completions';

        const response = await axios.post(
            url,
            {
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful assistant. Answer questions with a single word only. No explanation, no punctuation, just one word.'
                    },
                    {
                        role: 'user',
                        content: question
                    }
                ],
                model: 'llama-3.3-70b-versatile',
                temperature: 0,
                max_tokens: 10
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                timeout: 10000
            }
        );

        const answer = response.data?.choices?.[0]?.message?.content?.trim() || 'Unknown';

        return answer.split(/\s+/)[0].replace(/[^a-zA-Z0-9]/g, '');
    } catch (err) {
        if (err.response) {
            throw Object.assign(
                new Error(`AI API error: ${err.response.status} - ${err.response.data?.error?.message || 'Unknown error'}`),
                { statusCode: 500 }
            );
        }
        throw Object.assign(
            new Error(`AI API request failed: ${err.message}`),
            { statusCode: 500 }
        );
    }
}

module.exports = aiService;
