const express = require("express");

module.exports = function createOrderRoutes(orderService) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const orders = await orderService.listOrders();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
