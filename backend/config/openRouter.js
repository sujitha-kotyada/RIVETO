import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Main function
export const getReply = async ({ prompt }) => {
  try {
    const response = await client.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1",

      temperature: 0.2,
      max_tokens: 150,

      messages: [
        {
          role: "system",
          content: `
You are RIVETO AI Assistant.

Rules:
- Keep replies short and useful.
- Help users navigate website pages.
- ALWAYS return valid JSON only.

If navigation is needed:
{
  "type": "navigate",
  "route": "/route_here",
  "message": "short message"
}

If normal chat:
{
  "type": "chat",
  "message": "reply_here"
}

Routes:
Home=/ 
About=/about
Collection=/collection
NewArrivals=/new-arrivals
BestSellers=/best-sellers
Contact=/contact
Cart=/cart
Order=/order
FAQ=/faq
PlaceOrder=/placeorder
Privacy=/privicypolicy
Terms=/termsandservices
SizeGuide=/size-guide
Cookie=/cookie-policy
Contributors=/contributors
          `.trim(),
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = response.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    try {
      return JSON.parse(reply);
    } catch (err) {
      return {
        type: "chat",
        message: content || "No response from AI",
      };
    }
  } catch (error) {
    console.error("OpenRouter Error:", error);

    return {
      type: "chat",
      message: "Something went wrong. Please try again.",
    };
  }
};