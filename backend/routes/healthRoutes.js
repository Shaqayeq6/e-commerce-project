const express = require("express");

module.exports = function createHealthRoutes() {
  const router = express.Router();

  router.get("/", (req, res) => {
    res.json({ status: "Backend is running!" });
  });

  return router;
};
