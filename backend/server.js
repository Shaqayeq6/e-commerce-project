const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* -------------------------
   Dummy Product Data
-------------------------- */
const products = [
  {
    id: 1,
    name: "Black Hoodie",
    price: 59.99,
    category: "Hoodie",
    brand: "ShaqaWear",
    image: "https://via.placeholder.com/200",
    description: "Soft, warm hoodie for everyday wear."
  },
  {
    id: 2,
    name: "White T-Shirt",
    price: 29.99,
    category: "T-Shirt",
    brand: "ShaqaWear",
    image: "https://via.placeholder.com/200",
    description: "Classic white tee, breathable cotton."
  }
];

/* -------------------------
   Health Check Route
-------------------------- */
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running!" });
});

/* -------------------------
   Get All Products
-------------------------- */
app.get("/api/products", (req, res) => {
  res.json(products);
});

/* -------------------------
   Get Product By ID
-------------------------- */
app.get("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

/* -------------------------
   Start Server
-------------------------- */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});