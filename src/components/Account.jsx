import { useEffect, useState } from "react";
import { getToken } from "./Auth";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      setError("You must be logged in to view this page.");
      return;
    }

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
        fetchOrders();
      } catch (err) {
        setError("Unauthorized. Please log in again.");
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:3000/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userOrders = await res.json();
        console.log(userOrders);
        setOrders(userOrders);
      } catch (err) {
        console.error("Error fetching orders", err);
        setError("Failed to fetch orders.");
      }
    };

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
    return <p className="error-message">{error}</p>;
  }

  if (!user) {
    return <p className="loading-message">Loading account information...</p>;
  }

  return (
    <div className="accountContainer">
      <h2 className="accountWelcome">Welcome, {user.username}!</h2>

      <section className="accountSection" id="userReviews">
        <h3>Your Reviews</h3>
        {reviews.length === 0 ? (
          <p>You have not posted any reviews yet.</p>
        ) : (
          <ul className="reviewList">
            {reviews.map((review) => (
              <li className="singleReview" key={review.id}>
                <strong>{review.productTitle}</strong>
                <br />
                Rating: {review.rating}/5
                <br />
                Comment: {review.comment}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="accountSection" id="userOrders">
        <h3>Your Orders</h3>
        {orders.length === 0 ? (
          <p>You have yet to order any products.</p>
        ) : (
          <div className="orderList">
            {orders.map((order) => (
              <div className="orderCard" key={order.id}>
                <h4>Order #{order.id}</h4>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                <p>Note: {order.note}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}