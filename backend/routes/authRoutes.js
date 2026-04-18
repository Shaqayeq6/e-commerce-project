const express = require("express");

module.exports = function createAuthRoutes(authService) {
  const router = express.Router();

  router.post("/register", async (req, res, next) => {
    try {
      const result = await authService.register(req.body);
      res.status(result.status).json(result.body);
    } catch (error) {
      next(error);
    }
  });

  router.post("/login", async (req, res, next) => {
    try {
      const result = await authService.login(req.body);
      res.status(result.status).json(result.body);
    } catch (error) {
      next(error);
    }
  });

  router.post("/reset-password", async (req, res, next) => {
    try {
      const result = await authService.resetPassword(req.body);
      res.status(result.status).json(result.body);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
