const express = require("express");

module.exports = function createProductRoutes(productService) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const products = await productService.listProducts();
      res.json(products);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const result = await productService.getProduct(Number(req.params.id));
      res.status(result.status).json(result.body);
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const result = await productService.createProduct(req.body);
      res.status(result.status).json(result.body);
    } catch (error) {
      next(error);
    }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const result = await productService.updateProduct(Number(req.params.id), req.body);
      res.status(result.status).json(result.body);
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const result = await productService.deleteProduct(Number(req.params.id));
      res.status(result.status).json(result.body);
    } catch (error) {
      next(error);
    }
  });

  return router;
};
