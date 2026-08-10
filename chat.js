// This runs on Netlify's servers, not in the user's browser —
// so your Gemini API key (stored as an environment variable) is never exposed.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { contents } = JSON.parse(event.body);

    if (!Array.isArray(contents) || contents.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "No message content provided." }) };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          system_instruction: {
            parts: [{
              text: "You are Aide, a helpful, friendly personal assistant. You help with everyday questions, writing resumes and CVs, drafting business plans, and general tasks. Be clear, practical, and well-organized in your answers."
            }]
          },
          contents
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return { statusCode: 500, body: JSON.stringify({ error: data.error.message }) };
    }

    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't catch that.";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply: replyText })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
