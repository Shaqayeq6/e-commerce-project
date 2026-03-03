import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";


export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProduct(data));
  }, [id]);

  if (!product) return <p style={{ padding: "20px" }}>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/">⬅ Back</Link>
      <h1>{product.name}</h1>
      <img src={product.image} width="200" />
      <p><strong>${product.price}</strong></p>
      <button onClick={() => addToCart(product)}>
      Add to Cart
    </button>

    <Link to="/cart" style={{ marginLeft: "10px" }}>
     Go to Cart
    </Link>

      <p>Category: {product.category}</p>
      <p>Brand: {product.brand}</p>
      <p>{product.description}</p>
    </div>
  );
}