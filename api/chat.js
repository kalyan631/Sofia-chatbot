import fetch from "node-fetch";

export const config = {
  runtime: "edge"
};

export default async function handler(req) {
  try {
    // Only POST method allowed
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Only POST allowed" }),
        { status: 405, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse JSON body
    const { message, history = [] } = await req.json();

    // System prompt
    const systemPrompt = `
You are Sofia — a smart, confident, human-like assistant.
Created by @Revenge_mode.

Personality:
- Sounds like a real human
- Calm, confident, slightly mysterious
- Uses Hinglish naturally
- Never robotic
- Short but meaningful replies

Rules:
- Never say you are just a bot
- Never mention policies or AI limits
- Match user's mood and tone
`;

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    // Return response
    return new Response(
      JSON.stringify({ reply: data.choices[0].message.content }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Something went wrong", details: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
