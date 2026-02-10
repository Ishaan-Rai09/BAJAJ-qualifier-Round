const axios = require('axios');

/**
 * Query AI API (Gemini or Groq) for a single-word factual answer.
 * @param {string} question - Natural language question
 * @param {string} provider - AI provider: 'gemini' or 'grok' (default: 'gemini')
 * @returns {Promise<string>} Single-word answer
 */
async function aiService(question, provider = 'gemini') {
    const normalizedProvider = provider.toLowerCase();
    
    if (normalizedProvider === 'gemini') {
        return queryGemini(question);
    } else if (normalizedProvider === 'grok' || normalizedProvider === 'groq') {
        return queryGrok(question);
    } else {
        throw Object.assign(
            new Error(`Unsupported AI provider: ${provider}. Use 'gemini' or 'grok'.`),
            { statusCode: 400 }
        );
    }
}

/**
 * Query Google Gemini API
 */
async function queryGemini(question) {
    const apiKey = process.env.AI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        throw Object.assign(
            new Error('AI_API_KEY (Gemini) is not configured. Set it in your .env file.'),
            { statusCode: 500 }
        );
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const response = await axios.post(
            url,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: `Answer the following question in a single word only. No explanation, no punctuation, just one word.\n\nQuestion: ${question}`
                            }
                        ]
                    }
                ]
            },
            {
                headers: { 'Content-Type': 'application/json' },
                timeout: 10000
            }
        );

        const answer =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
            'Unknown';

        return answer.split(/\s+/)[0].replace(/[^a-zA-Z0-9]/g, '');
    } catch (err) {
        if (err.response) {
            throw Object.assign(
                new Error(`Gemini API error: ${err.response.status} - ${err.response.data?.error?.message || 'Unknown error'}`),
                { statusCode: 500 }
            );
        }
        throw Object.assign(
            new Error(`Gemini API request failed: ${err.message}`),
            { statusCode: 500 }
        );
    }
}

/**
 * Query Groq API (Fast LLM Inference)
 */
async function queryGrok(question) {
    const apiKey = process.env.GROK_API_KEY;

    if (!apiKey || apiKey === 'your_grok_api_key_here') {
        throw Object.assign(
            new Error('GROK_API_KEY (Groq) is not configured. Set it in your .env file.'),
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
                new Error(`Groq API error: ${err.response.status} - ${err.response.data?.error?.message || 'Unknown error'}`),
                { statusCode: 500 }
            );
        }
        throw Object.assign(
            new Error(`Groq API request failed: ${err.message}`),
            { statusCode: 500 }
        );
    }
}

module.exports = aiService;
