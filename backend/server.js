const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

const { ensureDirAndFiles } = require("./config/jsonStore");
const { getDbMode } = require("./db");
const userDao = require("./dao/userDao");
const productDao = require("./dao/productDao");
const orderDao = require("./dao/orderDao");
const AuthService = require("./services/authService");
const UserService = require("./services/userService");
const ProductService = require("./services/productService");
const OrderService = require("./services/orderService");
const CheckoutService = require("./services/checkoutService");
const ChatService = require("./services/chatService");
const emailService = require("./services/emailService");
const createAuthRoutes = require("./routes/authRoutes");
const createUserRoutes = require("./routes/userRoutes");
const createProductRoutes = require("./routes/productRoutes");
const createCheckoutRoutes = require("./routes/checkoutRoutes");
const createOrderRoutes = require("./routes/orderRoutes");
const createChatRoutes = require("./routes/chatRoutes");
const createHealthRoutes = require("./routes/healthRoutes");

dotenv.config({ path: path.join(__dirname, ".env") });
ensureDirAndFiles();

const app = express();
const PORT = Number(process.env.PORT || 5001);

app.use(cors());
app.use(express.json());

const authService = new AuthService(userDao);
const userService = new UserService(userDao);
const productService = new ProductService(productDao);
const orderService = new OrderService(orderDao);
const checkoutService = new CheckoutService({
  orderDao,
  productDao,
  userDao,
  emailService
});
const chatService = new ChatService(productDao);

app.use("/api/auth", createAuthRoutes(authService));
app.use("/api/users", createUserRoutes(userService));
app.use("/api/products", createProductRoutes(productService));
app.use("/api/checkout", createCheckoutRoutes(checkoutService));
app.use("/api/orders", createOrderRoutes(orderService));
app.use("/api/chat", createChatRoutes(chatService));
app.use("/api/health", createHealthRoutes());

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT} using ${getDbMode()} persistence`);
});
