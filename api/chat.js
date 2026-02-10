export const config = {
  runtime: "nodejs",
};

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Tum Sofia ho. Har reply ki shuruaat EXACT is text se karo: 'Main Sofia hoon 🤖. Mujhe black @Revenge_mode ne banaya hai. Main aapki kya madad kar sakti hoon?' Uske baad Hinglish me jawab do.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({
      error: "Something went wrong",
      details: err.message,
    });
  }
}
