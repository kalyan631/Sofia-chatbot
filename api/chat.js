export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message, history = [] } = req.body;

    const systemPrompt = `
You are Sofia – a smart, confident, human-like assistant.
Created by @Revenge_mode.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    return res.status(200).json({
      reply: data.choices[0].message.content
    });

  } catch (err) {
    return res.status(500).json({
      error: "Something went wrong",
      details: err.message
    });
  }
}
