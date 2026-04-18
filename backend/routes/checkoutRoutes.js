const express = require("express");

module.exports = function createCheckoutRoutes(checkoutService) {
  const router = express.Router();

  router.post("/", async (req, res, next) => {
    try {
      const result = await checkoutService.checkout(req.body);
      res.status(result.status).json(result.body);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
