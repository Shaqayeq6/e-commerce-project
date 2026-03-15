const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* -------------------------
   Dummy Product Data
-------------------------- */
let products = [
  {
    id: 1,
    name: "AirFlex Runner",
    brand: "Nike",
    category: "Men",
    type: "Running",
    price: 129.99,
    sizes: [7, 8, 9, 10, 11],
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
  },
  {
    id: 2,
    name: "Urban Street Sneaker",
    brand: "Adidas",
    category: "Women",
    type: "Casual",
    price: 109.99,
    sizes: [6, 7, 8, 9],
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77"
  },
  {
    id: 3,
    name: "TrailBlazer Hiker",
    brand: "Columbia",
    category: "Men",
    type: "Hiking",
    price: 149.99,
    sizes: [8, 9, 10, 11, 12],
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519"
  },
  {
    id: 4,
    name: "Office Loafer",
    brand: "Clarks",
    category: "Women",
    type: "Formal",
    price: 99.99,
    sizes: [6, 7, 8],
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5"
  },
  {
    id: 5,
    name: "KidsSprint",
    brand: "Puma",
    category: "Kids",
    type: "Sport",
    price: 49.99,
    sizes: [1, 2, 3, 4],
    image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1"
  },
  {
    id: 6,
    name: "Summer Sandal",
    brand: "Birkenstock",
    category: "Women",
    type: "Sandals",
    price: 79.99,
    sizes: [6, 7, 8, 9],
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a"
  }
];

/* -------------------------
   In-Memory Orders
-------------------------- */
const orders = [];

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
  const product = products.find((p) => p.id === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  res.json(product);
});

/* -------------------------
   Add Product
-------------------------- */
app.post("/api/products", (req, res) => {
  const { name, brand, category, type, price, sizes, image } = req.body;

  if (!name || !brand || !category || !type || !price || !image) {
    return res.status(400).json({
      success: false,
      message: "Missing product information"
    });
  }

  const newProduct = {
    id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    name,
    brand,
    category,
    type,
    price: Number(price),
    sizes: Array.isArray(sizes) ? sizes : [],
    image
  };

  products.push(newProduct);

  res.status(201).json({
    success: true,
    message: "Product added successfully",
    product: newProduct
  });
});

/* -------------------------
   Delete Product
-------------------------- */
app.delete("/api/products/:id", (req, res) => {
  const id = Number(req.params.id);
  const existingProduct = products.find((p) => p.id === id);

  if (!existingProduct) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  products = products.filter((p) => p.id !== id);

  res.json({
    success: true,
    message: "Product deleted successfully"
  });
});

/* -------------------------
   Checkout Route
-------------------------- */
app.post("/api/checkout", (req, res) => {
  console.log("Checkout route hit");
  console.log("Request body:", req.body);

  const { customer, items, total } = req.body;

  if (!customer || !items || !Array.isArray(items) || items.length === 0 || !total) {
    return res.status(400).json({
      success: false,
      message: "Missing order information"
    });
  }

  if (
    !customer.fullName ||
    !customer.email ||
    !customer.address ||
    !customer.city ||
    !customer.postalCode
  ) {
    return res.status(400).json({
      success: false,
      message: "Customer information is incomplete"
    });
  }

  const orderId = Math.floor(Math.random() * 1000000);

  const newOrder = {
    orderId,
    customer,
    items,
    total,
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);

  return res.status(200).json({
    success: true,
    message: "Payment authorized",
    orderId
  });
});

/* -------------------------
   Get All Orders
-------------------------- */
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

/* -------------------------
   Fallback Route
-------------------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

/* -------------------------
   Start Server
-------------------------- */
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});