const express = require("express");

module.exports = function createChatRoutes(chatService) {
  const router = express.Router();

  router.post("/", async (req, res, next) => {
    try {
      const result = await chatService.reply(req.body.message || "");
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
