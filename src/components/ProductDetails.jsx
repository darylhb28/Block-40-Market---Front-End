import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import fetchSingleProduct or whatever it's called from the API

function ProductDetails () {

    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([])
    const [comment, setComment] = useState("")
    const [rating, setRating] = useState("")
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
        // change what const token = if needed


useEffect(() => {
    async function fetchSingleProduct(){
        try {
            const response = await fetch(`http://localhost:3000/products/${id}`)
            const res = await response.json()
            console.log(res)
            setProduct(res);
        } catch (err) {
            console.error(err)
        }
    };
    fetchSingleProduct();
}, []);

useEffect(()=>{
    async function getReviews(){
        try {
            const response = await fetch (`http://localhost:3000/products/${id}/reviews`)
            const res = await response.json()
            setReviews(res)
        } catch (error){
            console.log(error)
        }
    }
    getReviews()

},[])


async function handleReview (){
    try {
        const response = await fetch(`http://localhost:3000/products${id}/reviews`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ 
                rating: rating,
                comment: comment
             }),
        });

        if (!res.ok) {
            throw new Error("Could not submit review.");
        }

        alert("Review uploaded");

    } catch (err) {
        console.error(err);
        alert ("Review was not possible.")
    }
};


return (
    
    <div>
        {product && (
            <div key={product.id} id="singleProductDisplay">
                <h1>{product.title}</h1>                
                <h2>{product.price}</h2>
                <img src={product.image_url} alt={product.title} />
                <h2>{product.description}</h2>
                        
              {reviews && (
                    <>
                        <h2>Reviews</h2>
                            {reviews.map((review) => (
                                <div key={review.id}>
                                    <h3>From User {review.user_id}: {review.comment}</h3>
                                    <h3>Rating: {review.rating}</h3>
                                </div>
                        ))}
                    </>
                    )}

            {token && (
                <>
                    <form onSubmit={handleReview}>
                                <h2>Submit Your own Review of this Product</h2>
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
                                </>
                            )}

            <button
                onClick = {() => navigate(`/`)}> 
                Return
            </button>

            </div>
        )}
    </div>

)
}

export default ProductDetails