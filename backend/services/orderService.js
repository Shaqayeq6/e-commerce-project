class OrderService {
  constructor(orderDao) {
    this.orderDao = orderDao;
  }

  async listOrders() {
    return this.orderDao.getAll();
  }
}

module.exports = OrderService;
