class UserService {
  constructor(userDao) {
    this.userDao = userDao;
  }

  sanitizeUser(user) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  async listUsers() {
    const users = await this.userDao.getAll();
    return users.map((user) => this.sanitizeUser(user));
  }

  async updateUser(id, payload) {
    const existing = await this.userDao.getById(id);
    if (!existing) {
      return { status: 404, body: { success: false, message: "User not found" } };
    }

    if (payload.email && payload.email.toLowerCase() !== existing.email.toLowerCase()) {
      const emailTaken = await this.userDao.getByEmail(payload.email);
      if (emailTaken && emailTaken.id !== existing.id) {
        return { status: 400, body: { success: false, message: "Email is already in use" } };
      }
    }

    const cardNumber = payload.cardNumber || existing.cardNumber || "";
    const nextFields = {
      fullName: payload.fullName ?? existing.fullName,
      username: payload.username ?? existing.username ?? "",
      email: payload.email ?? existing.email,
      password: payload.password ?? existing.password,
      role: payload.role ?? existing.role,
      phone: payload.phone ?? existing.phone ?? "",
      address: payload.address ?? existing.address ?? "",
      city: payload.city ?? existing.city ?? "",
      postalCode: payload.postalCode ?? existing.postalCode ?? "",
      cardLast4:
        payload.cardLast4 ??
        (cardNumber
          ? String(cardNumber).replace(/\s/g, "").slice(-4)
          : existing.cardLast4 ?? ""),
      cardNumber,
      nameOnCard: payload.nameOnCard ?? existing.nameOnCard ?? "",
      expiry: payload.expiry ?? existing.expiry ?? "",
      cvv: payload.cvv ?? existing.cvv ?? ""
    };

    const updated = await this.userDao.updateById(id, nextFields);

    return {
      status: 200,
      body: {
        success: true,
        message: "User updated successfully",
        user: this.sanitizeUser(updated)
      }
    };
  }
}

module.exports = UserService;
