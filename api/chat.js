import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { message, history = [] } = req.body;

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

  try {
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

    res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
