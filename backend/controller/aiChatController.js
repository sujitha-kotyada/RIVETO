import { getReply } from "../config/openRouter.js";

export const response = async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        type: "chat",
        message: "Message is required",
      });
    }

    const cleanMessage = message.trim();

    const aiResponse = await getReply({ prompt: cleanMessage });

    console.log("AI RAW RESPONSE:", aiResponse);

    let parsedResponse;

    if (typeof aiResponse === "object") {
      parsedResponse = aiResponse;
    } 

    else if (typeof aiResponse === "string") {
      try {
        parsedResponse = JSON.parse(aiResponse);
      } catch {
        parsedResponse = {
          type: "chat",
          message: aiResponse,
        };
      }
    } 
    
    else {
      parsedResponse = {
        type: "chat",
        message: "Unexpected AI response format",
      };
    }

    return res.status(200).json(parsedResponse);

  } catch (error) {
    console.error("AI response error:", error);

    return res.status(500).json({
      type: "chat",
      message: "Internal Server Error",
    });
  }
};