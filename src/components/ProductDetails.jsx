import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchSingleProduct() {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}`);
        const res = await response.json();
        setProduct(res);
      } catch (err) {
        console.error(err);
      }
    }
    fetchSingleProduct();
  }, [id]);

  useEffect(() => {
    async function getReviews() {
      try {
        const response = await fetch(`http://localhost:3000/products/${id}/reviews`);
        const res = await response.json();
        setReviews(res);
      } catch (error) {
        console.log(error);
      }
    }
    getReviews();
  }, [id]);

  async function handleReview(e) {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/products/${id}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: rating,
          comment: comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not submit review.");
      }

      alert("Review uploaded");
    } catch (err) {
      console.error(err);
      alert("Review was not possible.");
    }
  }

  async function handleOrder(e){
    e.preventDefault();
    try{   
      const response = await fetch(`http://localhost:3000/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: new Date().toISOString(),
          note: `1 ${product?.title}`,
          product_id: product?.id // not needed for backend query (yet)
        }),
      });
      console.log(response)
      if (!response.ok) {
        throw new Error("Could not place order.")
      }

      const res = await response.json();
      alert("Order placed.");
 
  } catch (err) {
      console.error(err);
      alert("Order was not possible.");
    }
  }

  return (
    <div className="productDetailContainer">
      {product && (
        <div key={product.id} id="singleProductDisplay">
          <h1 className="productTitle">{product.title}</h1>
          <h2 className="productPrice">${Number(product.price).toFixed(2)}</h2>
          <img className="productImage" src={product.image_url} alt={product.title} />
          <h2 className="productDescription">{product.description}</h2>

          {reviews && (
            <div className="reviewSection">
              <h2>Reviews</h2>
              {reviews.map((review) => (
                <div key={review.id} className="singleReview">
                  <h3>From User {review.user_id}: {review.comment}</h3>
                  <h3>Rating: {review.rating}</h3>
                </div>
              ))}
            </div>
          )}

          {token && (
            <form className="reviewForm" onSubmit={handleReview}>
              <h2>Submit Your Own Review</h2>
              <input
                type="text"
                placeholder="Type your comment here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                required
              >
                <option value="">Select a rating</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
              <button type="submit">Submit Review</button>
            </form>
          )}
          <div>
            <button className="orderButton" onClick={handleOrder}>
              Order Now
            </button>
          </div>

          <button className="returnButton" onClick={() => navigate(`/`)}>
            Return
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;