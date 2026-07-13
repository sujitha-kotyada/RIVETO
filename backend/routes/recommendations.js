import express from "express";
import { getRecommendations } from "../services/recommendationService.js";
import logger from "../config/logger.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { stack = "", level = "all", search = "", history = "" } = req.query;
    const userStack = stack
      ? stack
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
    const historyTerms = history
      ? history
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];
    const results = await getRecommendations({
      stack: userStack,
      level,
      search,
      history: historyTerms,
    });

    res.json({
      count: results.length,
      results,
    });
  } catch (error) {
    logger.error("Failed to fetch recommendations", { error: error.message });
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
});

export default router;
