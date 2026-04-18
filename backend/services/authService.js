class AuthService {
  constructor(userDao) {
    this.userDao = userDao;
  }

  sanitizeUser(user) {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async register({
    fullName,
    email,
    password,
    phone,
    address,
    city,
    postalCode,
    cardNumber,
    nameOnCard,
    expiry,
    cvv
  }) {
    if (!fullName || !email || !password) {
      return { status: 400, body: { success: false, message: "Missing required fields" } };
    }

    const existingUser = await this.userDao.getByEmail(email);
    if (existingUser) {
      return { status: 400, body: { success: false, message: "Email already registered" } };
    }

    const cardLast4 = cardNumber ? String(cardNumber).replace(/\s/g, "").slice(-4) : "";

    const newUser = await this.userDao.create({
      fullName,
      email,
      password,
      role: "customer",
      phone: phone || "",
      address: address || "",
      city: city || "",
      postalCode: postalCode || "",
      cardLast4,
      cardNumber: cardNumber || "",
      nameOnCard: nameOnCard || "",
      expiry: expiry || "",
      cvv: cvv || "",
      createdAt: new Date().toISOString()
    });

    return {
      status: 201,
      body: {
        success: true,
        message: "User registered successfully",
        user: this.sanitizeUser(newUser)
      }
    };
  }

  async login({ email, password }) {
    if (!email || !password) {
      return { status: 400, body: { success: false, message: "Email and password required" } };
    }

    const user = await this.userDao.getByEmail(email);
    if (!user || user.password !== password) {
      return { status: 401, body: { success: false, message: "Invalid email or password" } };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Login successful",
        user: this.sanitizeUser(user)
      }
    };
  }
}

module.exports = AuthService;
