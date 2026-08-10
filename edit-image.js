// This runs on Netlify's servers, not in the user's browser —
// so your Gemini API key (stored as an environment variable) is never exposed.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { instruction, mimeType, base64 } = JSON.parse(event.body);

    if (!base64 || !mimeType) {
      return { statusCode: 400, body: JSON.stringify({ error: "No image provided." }) };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [
              { text: instruction || "Improve this photo." },
              { inline_data: { mime_type: mimeType, data: base64 } }
            ]
          }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return { statusCode: 500, body: JSON.stringify({ error: data.error.message }) };
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    const textPart = parts.find((p) => p.text);
    const imagePart = parts.find((p) => p.inlineData || p.inline_data);

    if (!imagePart) {
      return {
        statusCode: 200,
        body: JSON.stringify({ text: textPart?.text || "Couldn't edit that image — try describing the change more specifically." })
      };
    }

    const inline = imagePart.inlineData || imagePart.inline_data;

    return {
      statusCode: 200,
      body: JSON.stringify({
        text: textPart?.text || "",
        image: {
          mimeType: inline.mimeType || inline.mime_type,
          base64: inline.data
        }
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
