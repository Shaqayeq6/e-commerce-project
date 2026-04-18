class ChatService {
  constructor(productDao) {
    this.productDao = productDao;
  }

  parseIntent(message) {
    const msg = message.toLowerCase().replace(/[']/g, "");

    return {
      category: this.detectCategory(msg),
      types: this.detectTypes(msg),
      priceLimit: this.extractPriceLimit(msg),
      raw: msg
    };
  }

  detectCategory(msg) {
    if (msg.includes("women") || msg.includes("womens")) return "Women";
    if (msg.includes("men") || msg.includes("mens")) return "Men";
    if (msg.includes("kids") || msg.includes("child")) return "Kids";
    return null;
  }

  detectTypes(msg) {
    const types = [];

    if (msg.includes("shoe") || msg.includes("shoes") || msg.includes("footwear")) {
      types.push("ANY_SHOE");
    }

    if (msg.includes("boot")) types.push("Boots");
    if (msg.includes("sneaker")) types.push("Sneaker");
    if (msg.includes("running")) types.push("Running");
    if (msg.includes("sport")) types.push("Sport");

    return types;
  }

  extractPriceLimit(msg) {
    const match = msg.match(/\$?(\d+)/);
    if (msg.includes("under") || msg.includes("below")) {
      return match ? parseInt(match[1], 10) : null;
    }
    return null;
  }

  recommendProducts(products, intent) {
    let results = [...products];

    if (intent.category) {
      results = results.filter((product) => product.category === intent.category);
    }

    const shoeTypes = ["Boots", "Sneaker", "Running", "Sport"];

    if (intent.types.includes("Boots")) {
      results = results.filter((product) => product.type === "Boots");
    } else if (intent.types.includes("Sneaker")) {
      results = results.filter((product) => product.type === "Sneaker");
    } else if (intent.types.includes("Running")) {
      results = results.filter((product) => product.type === "Running");
    } else if (intent.types.includes("Sport")) {
      results = results.filter((product) => product.type === "Sport");
    } else if (intent.types.includes("ANY_SHOE")) {
      results = results.filter((product) => shoeTypes.includes(product.type));
    }

    if (intent.priceLimit) {
      results = results.filter((product) => product.price <= intent.priceLimit);
    }

    if (results.length === 0) {
      return [];
    }

    results.sort(() => Math.random() - 0.5);
    return results.slice(0, 3);
  }

  async reply(message) {
    const products = await this.productDao.getAll();
    const intent = this.parseIntent(message);
    const results = this.recommendProducts(products, intent);

    if (
      message.toLowerCase().includes("shipping") ||
      message.toLowerCase().includes("ship") ||
      message.toLowerCase().includes("time")
    ) {
      return {
        success: true,
        reply: "Shipping usually takes 2-3 weeks depending on your location."
      };
    }

    if (message.toLowerCase().includes("order")) {
      return {
        success: true,
        reply: "You can view your orders in the Orders page after logging in."
      };
    }

    if (!results.length) {
      return {
        success: true,
        reply: {
          type: "text",
          message:
            "Sorry, we couldn't find anything matching your request. Please try searching for another product."
        }
      };
    }

    return {
      success: true,
      reply: {
        type: "products",
        items: results.map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description
        }))
      }
    };
  }
}

module.exports = ChatService;
