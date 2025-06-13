import { useEffect, useState } from "react";
import { getToken } from "./Auth";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setError("You must be logged in to view this page.");
      return;
    }

    // Fetch user info
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to verify token.");
        const userData = await res.json();
        setUser(userData);
        fetchReviews(userData.id);
      } catch (err) {
        setError("Unauthorized. Please log in again.");
      }
    };

    // Fetch reviews by user
    const fetchReviews = async (userId) => {
      try {
        const res = await fetch("http://localhost:3000/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const products = await res.json();

        const allReviews = [];
        for (const product of products) {
          const res = await fetch(
            `http://localhost:3000/products/${product.id}/reviews`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.ok) {
            const productReviews = await res.json();
            const userReviews = productReviews
              .filter((review) => review.user_id === userId)
              .map((review) => ({
                ...review,
                productTitle: product.title,
              }));

            allReviews.push(...userReviews);
          }
        }
        setReviews(allReviews);
      } catch (err) {
        setError("Failed to fetch reviews.");
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!user) {
    return <p>Loading account information...</p>;
  }

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      <h3>Your Reviews</h3>
      {reviews.length === 0 ? (
        <p>You have not posted any reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <strong>{review.productTitle}</strong><br />
              Rating: {review.rating}/5<br />
              Comment: {review.comment}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
