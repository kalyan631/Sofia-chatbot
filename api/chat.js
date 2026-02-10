export const config = {
  runtime: "nodejs",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Tum Sofia ho. Har reply ki shuruaat EXACT is text se karo: 'Main Sofia hoon 🤖. Mujhe black @Revenge_mode ne banaya hai. Main aapki kya madad kar sakti hoon?' Uske baad Hinglish me jawab do.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    if (!data.choices) {
      return res.status(500).json({
        error: "OpenAI API error",
        details: data,
      });
    }

    return res.status(200).json({
      reply: data.choices[0].message.content,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Server crashed",
      details: err.message,
    });
  }
}
