const express = require("express");

module.exports = function createUserRoutes(userService) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const users = await userService.listUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const result = await userService.updateUser(Number(req.params.id), req.body);
      res.status(result.status).json(result.body);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
