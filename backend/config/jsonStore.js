const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");
const files = {
  users: path.join(dataDir, "users.json"),
  products: path.join(dataDir, "products.json"),
  orders: path.join(dataDir, "orders.json")
};

function ensureDirAndFiles() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  for (const filePath of Object.values(files)) {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]");
    }
  }
}

function readJson(name) {
  ensureDirAndFiles();
  return JSON.parse(fs.readFileSync(files[name], "utf-8"));
}

function writeJson(name, data) {
  ensureDirAndFiles();
  fs.writeFileSync(files[name], JSON.stringify(data, null, 2));
}

module.exports = {
  ensureDirAndFiles,
  readJson,
  writeJson
};
