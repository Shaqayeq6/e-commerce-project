const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 5001;

const dataDir = path.join(__dirname, "data");
const usersPath = path.join(dataDir, "users.json");
const ordersPath = path.join(dataDir, "orders.json");
const productsPath = path.join(dataDir, "products.json");

function ensureFile(filePath, defaultData) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
}

function readData(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeData(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

ensureFile(usersPath, []);
ensureFile(ordersPath, []);
ensureFile(productsPath, []);

// Payment attempt counter for dummy rejection algorithm
let paymentAttempts = 0;

/* -------------------------
   Auth Routes
-------------------------- */

// Register
app.post("/api/auth/register", (req, res) => {
  const users = readData(usersPath);
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields"
    });
  }

  const existingUser = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already registered"
    });
  }

  const newUser = {
    id: users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    fullName,
    email,
    password,
    role: "customer",
    address: "",
    city: "",
    postalCode: "",
    cardLast4: "",
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeData(usersPath, users);

  const { password: _, ...userWithoutPassword } = newUser;

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: userWithoutPassword
  });
});

// Login
app.post("/api/auth/login", (req, res) => {
  const users = readData(usersPath);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password required"
    });
  }

  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }

  const { password: _, ...userWithoutPassword } = user;

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: userWithoutPassword
  });
});

/* -------------------------
   Users
-------------------------- */

// Get all users
app.get("/api/users", (req, res) => {
  const users = readData(usersPath);
  const safeUsers = users.map(({ password, ...u }) => u);
  res.json(safeUsers);
});

// Update user
app.put("/api/users/:id", (req, res) => {
  const users = readData(usersPath);
  const id = Number(req.params.id);

  const {
    fullName,
    email,
    role,
    address = "",
    city = "",
    postalCode = "",
    cardLast4 = ""
  } = req.body;

  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  if (!fullName || !email || !role) {
    return res.status(400).json({
      success: false,
      message: "Missing required user fields"
    });
  }

  const emailTaken = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.id !== id
  );

  if (emailTaken) {
    return res.status(400).json({
      success: false,
      message: "Email is already in use"
    });
  }

  users[userIndex] = {
    ...users[userIndex],
    fullName,
    email,
    role,
    address,
    city,
    postalCode,
    cardLast4
  };

  writeData(usersPath, users);

  const { password: _, ...updatedUser } = users[userIndex];

  res.json({
    success: true,
    message: "User updated successfully",
    user: updatedUser
  });
});

/* -------------------------
   Products
-------------------------- */

// Get all products
app.get("/api/products", (req, res) => {
  const products = readData(productsPath);
  res.json(products);
});

// Get product by id
app.get("/api/products/:id", (req, res) => {
  const products = readData(productsPath);
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

// Add product
app.post("/api/products", (req, res) => {
  const products = readData(productsPath);
  const { name, brand, category, type, price, sizes, image, quantity, description } = req.body;

  if (!name || !brand || !category || !type || !price || !image || quantity === undefined) {
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
    quantity: Number(quantity),
    sizes: Array.isArray(sizes) ? sizes : [],
    image,
    description: description || ""
  };

  products.push(newProduct);
  writeData(productsPath, products);

  res.status(201).json({
    success: true,
    message: "Product added successfully",
    product: newProduct
  });
});

// Delete product
app.delete("/api/products/:id", (req, res) => {
  const products = readData(productsPath);
  const id = Number(req.params.id);

  const existingProduct = products.find((p) => p.id === id);

  if (!existingProduct) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  const updatedProducts = products.filter((p) => p.id !== id);
  writeData(productsPath, updatedProducts);

  res.json({
    success: true,
    message: "Product deleted successfully"
  });
});

// Update product
app.put("/api/products/:id", (req, res) => {
  const products = readData(productsPath);
  const id = Number(req.params.id);
  const { quantity, price } = req.body;

  const productIndex = products.findIndex((p) => p.id === id);

  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Not found"
    });
  }

  if (quantity !== undefined) {
    if (Number(quantity) < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity"
      });
    }
    products[productIndex].quantity = Number(quantity);
  }

  if (price !== undefined) {
    products[productIndex].price = Number(price);
  }

  writeData(productsPath, products);

  res.json({
    success: true,
    product: products[productIndex]
  });
});

/* -------------------------
   Checkout
-------------------------- */

app.post("/api/checkout", (req, res) => {
  const orders = readData(ordersPath);
  const users = readData(usersPath);
  const products = readData(productsPath);

  const { customer, items, total, paymentMethod } = req.body;

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

  // Dummy payment rejection algorithm: deny every 3rd request
  paymentAttempts++;
  if (paymentAttempts % 3 === 0) {
    return res.status(400).json({
      success: false,
      message: "Credit Card Authorization Failed."
    });
  }

  for (const item of items) {
    const product = products.find((p) => p.id === item.id);

    if (!product || product.quantity < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `We do not have the requested stock amount for ${item.name}`
      });
    }
  }

  for (const item of items) {
    const product = products.find((p) => p.id === item.id);
    product.quantity -= item.quantity;
  }

  const existingUserIndex = users.findIndex(
    (u) => u.email.toLowerCase() === customer.email.toLowerCase()
  );

  if (existingUserIndex !== -1) {
    users[existingUserIndex] = {
      ...users[existingUserIndex],
      fullName: customer.fullName,
      email: customer.email,
      address: customer.address,
      city: customer.city,
      postalCode: customer.postalCode,
      cardLast4: paymentMethod?.last4 || users[existingUserIndex].cardLast4
    };
  }

  const orderId = Math.floor(Math.random() * 1000000);

  const newOrder = {
    orderId,
    customer,
    items,
    total,
    paymentMethod,
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);

  writeData(productsPath, products);
  writeData(usersPath, users);
  writeData(ordersPath, orders);

  res.status(200).json({
    success: true,
    message: "Payment authorized",
    orderId
  });
});

/* -------------------------
   Orders
-------------------------- */

app.get("/api/orders", (req, res) => {
  const orders = readData(ordersPath);
  res.json(orders);
});

/* -------------------------
   Health
-------------------------- */

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running!" });
});

/* -------------------------
   Fallback
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});