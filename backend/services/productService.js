class ProductService {
  constructor(productDao) {
    this.productDao = productDao;
  }

  async listProducts() {
    return this.productDao.getAll();
  }

  async getProduct(id) {
    const product = await this.productDao.getById(id);

    if (!product) {
      return { status: 404, body: { success: false, message: "Product not found" } };
    }

    return { status: 200, body: product };
  }

  async createProduct(payload) {
    const { name, brand, category, type, price, sizes, image, quantity, description } =
      payload;

    if (!name || !brand || !category || !type || !price || !image || quantity === undefined) {
      return { status: 400, body: { success: false, message: "Missing product information" } };
    }

    const product = await this.productDao.create({
      name,
      brand,
      category,
      type,
      price: Number(price),
      quantity: Number(quantity),
      sizes: Array.isArray(sizes) ? sizes : [],
      image,
      description: description || ""
    });

    return {
      status: 201,
      body: {
        success: true,
        message: "Product added successfully",
        product
      }
    };
  }

  async deleteProduct(id) {
    const deleted = await this.productDao.deleteById(id);

    if (!deleted) {
      return { status: 404, body: { success: false, message: "Product not found" } };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Product deleted successfully"
      }
    };
  }

  async updateProduct(id, payload) {
    const existing = await this.productDao.getById(id);

    if (!existing) {
      return { status: 404, body: { success: false, message: "Not found" } };
    }

    if (payload.quantity !== undefined && Number(payload.quantity) < 0) {
      return { status: 400, body: { success: false, message: "Invalid quantity" } };
    }

    const updated = await this.productDao.updateById(id, {
      ...existing,
      quantity:
        payload.quantity !== undefined ? Number(payload.quantity) : existing.quantity,
      price: payload.price !== undefined ? Number(payload.price) : existing.price
    });

    return {
      status: 200,
      body: {
        success: true,
        product: updated
      }
    };
  }
}

module.exports = ProductService;
