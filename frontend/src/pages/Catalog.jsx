import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Catalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>ShaqaWear Store</h1>

      {products.map(p => (
        <div key={p.id} style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "10px" }}>
          <img src={p.image} width="120" />
          <h2>{p.name}</h2>
          <p><strong>${p.price}</strong></p>

          <Link to={`/product/${p.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}