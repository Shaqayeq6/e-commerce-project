class CheckoutService {
  constructor({ orderDao, productDao, userDao, emailService }) {
    this.orderDao = orderDao;
    this.productDao = productDao;
    this.userDao = userDao;
    this.emailService = emailService;
  }

  async checkout({ customer, items, total, paymentMethod }) {
    if (!customer || !items || !Array.isArray(items) || items.length === 0 || !total) {
      return { status: 400, body: { success: false, message: "Missing order information" } };
    }

    if (
      !customer.fullName ||
      !customer.email ||
      !customer.address ||
      !customer.city ||
      !customer.postalCode
    ) {
      return {
        status: 400,
        body: { success: false, message: "Customer information is incomplete" }
      };
    }

    const products = await this.productDao.getAll();

    for (const item of items) {
      const product = products.find((entry) => entry.id === item.id);

      if (!product || product.quantity < item.quantity) {
        return {
          status: 400,
          body: {
            success: false,
            message: `We do not have the requested stock amount for ${item.name}`
          }
        };
      }
    }

    for (const item of items) {
      const product = products.find((entry) => entry.id === item.id);
      await this.productDao.updateById(item.id, {
        ...product,
        quantity: product.quantity - item.quantity
      });
    }

    const existingUser = await this.userDao.getByEmail(customer.email);

    if (existingUser) {
      await this.userDao.updateById(existingUser.id, {
        ...existingUser,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone ?? existingUser.phone ?? "",
        address: customer.address,
        city: customer.city,
        postalCode: customer.postalCode,
        cardLast4: paymentMethod?.last4 || existingUser.cardLast4 || ""
      });
    }

    const order = {
      orderId: Math.floor(Math.random() * 1000000),
      customer,
      items,
      total,
      paymentMethod,
      createdAt: new Date().toISOString()
    };

    const confirmationEmail = await this.emailService.sendOrderConfirmationEmail(order);
    order.confirmationEmail = confirmationEmail;
    await this.orderDao.create(order);

    return {
      status: 200,
      body: {
        success: true,
        message:
          confirmationEmail.status === "sent"
            ? "Payment authorized"
            : "Payment authorized, but confirmation email was not sent",
        orderId: order.orderId,
        confirmationEmail
      }
    };
  }
}

module.exports = CheckoutService;
