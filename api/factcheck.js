import axios from 'axios';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: `You are a fact-checking assistant. Analyze this statement and determine if it's true, false, or requires more context. Provide a brief, clear assessment:\n\n"${text}"`
          }]
        }]
      }
    );

    const result = response.data.candidates[0].content.parts[0].text;
    return res.status(200).json({ result });
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    return res.status(500).json({ error: 'Fact-check failed. Please try again.' });
  }
}
