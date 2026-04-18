import { useEffect, useState, useContext, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { RecentlyViewedContext } from "../context/RecentlyViewedContext";
import { AuthContext } from "../context/AuthContext";

import { apiUrl } from "../lib/api";
export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, cart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const { trackRecentlyViewed } = useContext(RecentlyViewedContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    comment: ""
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    fetch(apiUrl(`/api/products/${id}`))
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        trackRecentlyViewed(data);

        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(String(data.sizes[0]));
        }
      })
      .catch((err) => {
        console.error(err);
        setProduct(null);
      });
  }, [id, trackRecentlyViewed]);

  useEffect(() => {
    fetch(apiUrl("/api/products"))
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        return res.json();
      })
      .then((data) => setAllProducts(data))
      .catch((err) => {
        console.error("Failed to load recommended products", err);
      });
  }, []);

  useEffect(() => {
    if (!product) return;

    const storedReviews = localStorage.getItem(`reviews:${product.id}`);
    setReviews(storedReviews ? JSON.parse(storedReviews) : []);
  }, [product]);

  useEffect(() => {
    if (user) {
      setReviewForm((prev) => ({
        ...prev,
        name: prev.name || user.fullName
      }));
    }
  }, [user]);

  // Hooks MUST be before any return
  const currentInCart = useMemo(() => {
    if (!product) return 0;

    return cart
      .filter(
        (item) =>
          item.id === product.id &&
          String(item.selectedSize || "") === String(selectedSize || "")
      )
      .reduce((sum, item) => sum + item.quantity, 0);
  }, [cart, product, selectedSize]);

  const recommendedProducts = useMemo(() => {
    if (!product) return [];

    return allProducts
      .filter((item) => item.id !== product.id)
      .sort((a, b) => {
        const aScore =
          (a.brand === product.brand ? 2 : 0) +
          (a.category === product.category ? 1 : 0);
        const bScore =
          (b.brand === product.brand ? 2 : 0) +
          (b.category === product.category ? 1 : 0);

        return bScore - aScore;
      })
      .slice(0, 3);
  }, [allProducts, product]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  }, [reviews]);

  // ✅ Safe to return after hooks
  if (!product) {
    return (
      <div style={{ padding: 20 }}>
        <Link to="/">⬅ Back to Store</Link>
        <p style={{ marginTop: 12 }}>Loading product...</p>
      </div>
    );
  }

  const sizes = product.sizes?.length ? product.sizes : [];
  const maxAvailable = product.quantity - currentInCart;

  const increase = () => {
    if (qty < maxAvailable) {
      setQty((prev) => prev + 1);
    }
  };

  const decrease = () => {
    if (qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  const handleAdd = () => {
    if (maxAvailable <= 0) {
      setMessage("No more stock available for this selection.");
      return;
    }

    const itemToAdd = sizes.length
      ? { ...product, selectedSize }
      : { ...product };

    addToCart(itemToAdd, qty);

    setMessage("Added to cart!");
    setQty(1);
  };

  const handleReviewChange = (field, value) => {
    setReviewForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const submitReview = () => {
    const name = reviewForm.name.trim() || "Anonymous Shopper";
    const comment = reviewForm.comment.trim();

    const newReview = {
      id: Date.now(),
      name,
      rating: Number(reviewForm.rating),
      comment,
      createdAt: new Date().toISOString()
    };

    const updatedReviews = [newReview, ...reviews].slice(0, 6);
    setReviews(updatedReviews);
    localStorage.setItem(`reviews:${product.id}`, JSON.stringify(updatedReviews));
    setReviewForm({
      name: user?.fullName || "",
      rating: 5,
      comment: ""
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <Link to="/">⬅ Back to Store</Link>

      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          alignItems: "start"
        }}
      >
        {/* Image */}
        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", borderRadius: 12 }}
          />
        </div>

        {/* Details */}
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16
            }}
          >
            <h1 style={{ margin: "0 0 6px" }}>{product.name}</h1>

            <button
              onClick={() => toggleWishlist(product)}
              aria-label={
                isInWishlist(product.id)
                  ? `Remove ${product.name} from wishlist`
                  : `Add ${product.name} to wishlist`
              }
              title={
                isInWishlist(product.id)
                  ? "Remove from wishlist"
                  : "Add to wishlist"
              }
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                border: isInWishlist(product.id) ? "1px solid #be123c" : "1px solid #ddd",
                background: isInWishlist(product.id) ? "#fff1f2" : "#fff",
                color: isInWishlist(product.id) ? "#be123c" : "#444",
                fontSize: 20,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                flexShrink: 0
              }}
            >
              {isInWishlist(product.id) ? "♥" : "♡"}
            </button>
          </div>

          <div style={{ opacity: 0.85, marginBottom: 10 }}>
            {product.category} • {product.brand} • {product.type}
          </div>

          {isInWishlist(product.id) && (
            <div
              style={{
                display: "inline-block",
                marginBottom: 12,
                padding: "6px 10px",
                borderRadius: 999,
                background: "#fff1f2",
                color: "#be123c",
                fontSize: 13,
                fontWeight: 600
              }}
            >
              Saved to wishlist
            </div>
          )}

          <div style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>
            ${product.price.toFixed(2)}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ color: "#d97706", letterSpacing: "0.08em" }}>
              {"★".repeat(Math.round(averageRating || 0))}
              {"☆".repeat(5 - Math.round(averageRating || 0))}
            </div>
            <span style={{ fontSize: 14, color: "#666" }}>
              {reviews.length > 0
                ? `${averageRating.toFixed(1)} rating from ${reviews.length} review${reviews.length > 1 ? "s" : ""}`
                : "No reviews yet"}
            </span>
          </div>

          {/* Stock display */}
          <div style={{ marginBottom: 10 }}>
            {product.quantity === 0 ? (
              <span style={{ color: "red", fontWeight: "bold" }}>
                Out of Stock
              </span>
            ) : product.quantity <= 3 ? (
              <span style={{ color: "#d97706", fontWeight: "bold" }}>
                Only {product.quantity} left!
              </span>
            ) : (
              <span style={{ opacity: 0.7 }}>
                {product.quantity} in stock
              </span>
            )}
          </div>

          <p style={{ lineHeight: 1.5 }}>{product.description}</p>

          {/* Size selector */}
          {sizes.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <label style={{ display: "block", marginBottom: 6 }}>
                Select size:
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                style={{ padding: 10, minWidth: 180 }}
              >
                {sizes.map((s) => (
                  <option key={s} value={String(s)}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Quantity selector */}
          <div style={{ marginTop: 14 }}>
            <label style={{ display: "block", marginBottom: 6 }}>
              Quantity:
            </label>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={decrease}
                disabled={qty <= 1}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  cursor: qty <= 1 ? "not-allowed" : "pointer"
                }}
              >
                -
              </button>

              <div style={{ minWidth: 30, textAlign: "center" }}>{qty}</div>

              <button
                onClick={increase}
                disabled={qty >= maxAvailable}
                style={{
                  padding: "6px 10px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  cursor: qty >= maxAvailable ? "not-allowed" : "pointer"
                }}
              >
                +
              </button>

              <span style={{ fontSize: 13, opacity: 0.7 }}>
                {maxAvailable} available
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <button
              onClick={handleAdd}
              disabled={product.quantity === 0 || maxAvailable === 0}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #111",
                background:
                  product.quantity === 0 || maxAvailable === 0
                    ? "#888"
                    : "#111",
                color: "white",
                cursor:
                  product.quantity === 0 || maxAvailable === 0
                    ? "not-allowed"
                    : "pointer"
              }}
            >
              {product.quantity === 0
                ? "Out of Stock"
                : maxAvailable === 0
                ? "Max in Cart"
                : "Add to Cart"}
            </button>

            <Link
              to="/cart"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #111",
                textDecoration: "none",
                color: "#111"
              }}
            >
              Go to Cart
            </Link>
          </div>

          {/* Feedback */}
          {message && (
            <div
              style={{
                marginTop: 12,
                color: "#065f46",
                background: "#d1fae5",
                padding: "8px 12px",
                borderRadius: 8
              }}
            >
              {message}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: 36,
          padding: 20,
          border: "1px solid #ececec",
          borderRadius: 18,
          background: "#fafafa"
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>Ratings & Reviews</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr",
            gap: 20
          }}
        >
          <div>
            <p style={{ marginTop: 0, color: "#666" }}>
              Leave a quick rating or short comment for this product.
            </p>

            <label style={{ display: "block", marginBottom: 6 }}>Name</label>
            <input
              value={reviewForm.name}
              onChange={(e) => handleReviewChange("name", e.target.value)}
              placeholder="Your name"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 10,
                border: "1px solid #d7d7d7",
                marginBottom: 12,
                boxSizing: "border-box"
              }}
            />

            <label style={{ display: "block", marginBottom: 6 }}>Rating</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleReviewChange("rating", star)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    border: "1px solid #d7d7d7",
                    background: reviewForm.rating >= star ? "#fff7ed" : "#fff",
                    color: reviewForm.rating >= star ? "#d97706" : "#777",
                    cursor: "pointer",
                    fontSize: 18
                  }}
                >
                  ★
                </button>
              ))}
            </div>

            <label style={{ display: "block", marginBottom: 6 }}>Comment</label>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => handleReviewChange("comment", e.target.value)}
              placeholder="Share a quick thought about the fit, comfort, or style..."
              rows={4}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 12,
                border: "1px solid #d7d7d7",
                marginBottom: 12,
                resize: "vertical",
                boxSizing: "border-box"
              }}
            />

            <button
              onClick={submitReview}
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #111",
                background: "#111",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Submit Review
            </button>
          </div>

          <div>
            {reviews.length === 0 ? (
              <div
                style={{
                  border: "1px dashed #d7d7d7",
                  borderRadius: 14,
                  padding: 18,
                  background: "#fff"
                }}
              >
                No reviews yet. Be the first to rate this product.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      border: "1px solid #e5e5e5",
                      borderRadius: 14,
                      padding: 14,
                      background: "#fff"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8
                      }}
                    >
                      <strong>{review.name}</strong>
                      <span style={{ color: "#d97706", letterSpacing: "0.08em" }}>
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#777", marginBottom: 8 }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                    <p style={{ margin: 0, color: "#444", lineHeight: 1.5 }}>
                      {review.comment || "Rated this product."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {recommendedProducts.length > 0 && (
        <div
          style={{
            marginTop: 40,
            paddingTop: 28,
            borderTop: "1px solid #ededed"
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.8rem" }}>You May Also Like</h2>
          <p style={{ margin: "8px 0 18px", color: "#666" }}>
            Similar styles based on this product's brand and category.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 18
            }}
          >
            {recommendedProducts.map((item) => (
              <Link
                key={item.id}
                to={`/product/${item.id}`}
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: 18,
                  padding: 14,
                  textDecoration: "none",
                  color: "inherit",
                  background: "#fff",
                  boxShadow: "0 12px 28px rgba(15, 23, 42, 0.06)"
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 14,
                    marginBottom: 12
                  }}
                />

                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.62,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 6
                  }}
                >
                  {item.category} • {item.brand}
                </div>

                <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.name}</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>
                  ${Number(item.price).toFixed(2)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
