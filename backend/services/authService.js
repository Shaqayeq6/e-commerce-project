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
    username,
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
      username: username || "",
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
  async resetPassword({ email, username, newPassword }) {
    if (!email || !username || !newPassword) {
      return { status: 400, body: { success: false, message: "Email, username, and new password are required" } };
    }

    const user = await this.userDao.getByEmail(email);

    // Return generic success even if user not found (security best practice)
    if (!user || !user.username || user.username.toLowerCase() !== username.toLowerCase()) {
      return { status: 200, body: { success: true, message: "If that account exists, the password was reset." } };
    }

    user.password = newPassword;
    await this.userDao.update(user.id, user);

    return {
      status: 200,
      body: { success: true, message: "Password successfully updated" }
    };
  }
}

module.exports = AuthService;
