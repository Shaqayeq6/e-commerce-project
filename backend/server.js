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
    name: "AirFlex Runner",
    price: 129.99,
    category: "Women",
    sizes: [6, 7, 8, 9, 10],
    brand: "Nike",
    type: "Running",
    image: "https://via.placeholder.com/200",
    description: "Lightweight running shoes with breathable mesh."
  },
  {
    id: 2,
    name: "Street Classic",
    price: 89.99,
    category: "Men",
    sizes: [6, 7, 8, 9, 10],
    brand: "Adidas",
    type: "Sneakers",
    image: "https://via.placeholder.com/200",
    description: "Everyday sneakers with durable sole and comfort fit."
  },
  {
    id: 3,
    name: "KidSprint",
    price: 49.99,
    category: "Kids",
    sizes: [1, 2, 3, 4, 5],
    brand: "Puma",
    type: "Sport",
    image: "https://via.placeholder.com/200",
    description: "Comfortable sports shoes for active kids."
  },
  {
    id: 4,
    name: "Office Loafer",
    price: 99.99,
    category: "Women",
    sizes: [6, 7, 8, 9, 10],
    brand: "Clarks",
    type: "Formal",
    image: "https://via.placeholder.com/200",
    description: "Clean loafer style for office and formal wear."
  },
  {
    id: 5,
    name: "Trail Master",
    price: 149.99,
    category: "Men",
    sizes: [6, 7, 8, 9, 10],
    brand: "Salomon",
    type: "Hiking",
    image: "https://via.placeholder.com/200",
    description: "Grip-focused hiking shoes for trails and outdoor use."
  },
  {
    id: 6,
    name: "MiniSandals",
    price: 29.99,
    category: "Kids",
    sizes: [1, 2, 3, 4, 5],
    brand: "Crocs",
    type: "Sandals",
    image: "https://via.placeholder.com/200",
    description: "Easy slip-on sandals for summer days."
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

app.post("/api/checkout", (req, res) => {
  const { customer, cart } = req.body;

  // Basic validation
  if (!customer || !cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ message: "Invalid checkout data." });
  }

  // Dummy “payment” rule:
  // If last digit of postal code is EVEN -> approved, ODD -> denied
  const lastChar = String(customer.postalCode || "").trim().slice(-1);
  const lastDigit = Number(lastChar);

  const approved = Number.isFinite(lastDigit) && lastDigit % 2 === 0;

  if (!approved) {
    return res.status(402).json({ message: "Credit Card Authorization Failed." });
  }

  const orderId = Math.floor(Math.random() * 1000000);

  return res.json({
    message: "Payment approved.",
    orderId
  });
});
/* -------------------------
   Start Server
-------------------------- */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});