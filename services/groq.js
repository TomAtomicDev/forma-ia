const Groq = require("groq-sdk");
require('dotenv').config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const groqService = {
  name: "groqTextMessage",
  async chat(messages) {
    try {
      console.log("Groq Service: ", messages);
      const completion = await groq.chat.completions.create({
        model: "moonshotai/kimi-k2-instruct-0905",
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      });
      return completion.choices[0]?.message?.content;
    } catch (error) {
      console.error("Error en Groq Service:", error);
      throw error;
    }
  },
};

module.exports = { groqService };