import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import fetchSingleProduct or whatever it's called from the API

function ProductDetails () {

    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
        // change what const token = if needed


useEffect(() => {
    const getProduct = async () => {
        try {
            const data = await fetchSingleProduct(id);
            setProduct(data);
        } catch (err) {
            console.error(err)
        }
    };
    getProduct();
}, [id]);


const handleOrder = async (productId) =>{
    try {
    // add code to handle a product order to put it on the user page
        const res = await fetch(`http://localhost:3000/orders`, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ productId }),
        });

        if (!res.ok) {
            throw new Error("Could not place your order.");
        }

        alert("Order placed successfully!");

    } catch (err) {
        console.error(err);
        alert ("Order was not possible.")
    }
};


return (

    <div>
        {product && (
            <div key={product.id} id="singleProductDisplay">
                <h1>{product.title}</h1>                
                <h2>{product.price}</h2>
                <img src={product.image} alt={product.title} />
                <h2>{product.description}</h2>

            {token && (
                <>
                    <button
                        onClick = {() => handleOrder(product.id)}>
                        Order Now!
                    </button>
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