import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Admin() {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "",
    type: "",
    price: "",
    quantity: "",
    sizes: "",
    image: ""
  });

  const [editingProduct, setEditingProduct] = useState(null);

  const saveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: Number(editingProduct.price),
          quantity: Number(editingProduct.quantity)
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "Failed to edit product");
        return;
      }
      setEditingProduct(null);
      loadProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to edit product");
    }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      loadProducts();
    }
  }, [user]);

  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addProduct = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        sizes: form.sizes
          .split(",")
          .map((s) => Number(s.trim()))
          .filter((n) => !Number.isNaN(n))
      };

      const res = await fetch("http://localhost:5001/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to add product");
        return;
      }

      setForm({
        name: "",
        brand: "",
        category: "",
        type: "",
        price: "",
        quantity: "",
        sizes: "",
        image: ""
      });

      loadProducts();
    } catch (err) {
      console.error("Add product error:", err);
      alert("Failed to add product");
    }
  };

  const deleteProduct = async (id) => {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5001/api/products/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Failed to delete product");
        return;
      }

      loadProducts();
    } catch (err) {
      console.error("Delete product error:", err);
      alert("Failed to delete product");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
        <h1>Access Denied</h1>
        <p>You must be logged in as admin to view this page.</p>
        <Link to="/">⬅ Back to Store</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 20 }}>Admin Panel</h1>

      <div style={{ marginBottom: 16 }}>
        <Link to="/">⬅ Back to Store</Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 24
        }}
      >
        {/* ---------------- Add Product Form ---------------- */}
        <form
          onSubmit={addProduct}
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 16
          }}
        >
          <h2 style={{ marginBottom: 16 }}>Add Product</h2>

          <input
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={onChange}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          />

          <input
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={onChange}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={onChange}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          />

          <input
            name="type"
            placeholder="Type"
            value={form.type}
            onChange={onChange}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          />

          <input
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={onChange}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          />

          <input
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={onChange}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          />

          <input
            name="sizes"
            placeholder="Sizes (example: 6,7,8,9)"
            value={form.sizes}
            onChange={onChange}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          />

          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={onChange}
            style={{ width: "100%", padding: 10, marginBottom: 12 }}
          />

          <button
            type="submit"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid #111",
              background: "#111",
              color: "white",
              cursor: "pointer"
            }}
          >
            Add Product
          </button>
        </form>

        {/* ---------------- Product List ---------------- */}
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 16
          }}
        >
          <h2 style={{ marginBottom: 16 }}>All Products</h2>

          {loading ? (
            <p>Loading products...</p>
          ) : products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #eee",
                    borderRadius: 10,
                    padding: 12,
                    gap: 16
                  }}
                >
                  <div style={{ display: "flex", gap: 16 }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 10
                      }}
                    />

                    {editingProduct && editingProduct.id === product.id ? (
                      <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                        <div style={{ fontWeight: "bold" }}>{product.name}</div>
                        <label style={{fontSize: 12}}>Price: <input value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} style={{width: 60}} /></label>
                        <label style={{fontSize: 12}}>Qty: <input value={editingProduct.quantity} onChange={e => setEditingProduct({...editingProduct, quantity: e.target.value})} style={{width: 60}} /></label>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontWeight: "bold" }}>{product.name}</div>
                        <div style={{ fontSize: 13, opacity: 0.8 }}>
                          {product.brand} • {product.category} • {product.type}
                        </div>
                        <div style={{ fontSize: 13 }}>
                          ${Number(product.price).toFixed(2)}
                        </div>
                        <div style={{ fontSize: 13 }}>
                          Quantity: {product.quantity}
                        </div>
                        <div style={{ fontSize: 13 }}>
                          Sizes: {product.sizes.join(", ")}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{display: "flex", gap: 8}}>
                    {editingProduct && editingProduct.id === product.id ? (
                      <>
                        <button onClick={saveEdit} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #111", background: "#111", color: "white", cursor: "pointer" }}>Save</button>
                        <button onClick={() => setEditingProduct(null)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ccc", background: "white", cursor: "pointer" }}>Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => setEditingProduct(product)} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #111", background: "white", cursor: "pointer" }}>Edit</button>
                    )}
                    <button
                      onClick={() => deleteProduct(product.id)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid #b00020",
                        background: "white",
                        color: "#b00020",
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}