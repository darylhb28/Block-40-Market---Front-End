import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// add import from wherever we're calling the fetchAllProducts 

function ProductList () {

    const [products, setProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const navigate = useNavigate();


useEffect(() => {
  async function fetchAllProducts(){
        try {
            const response = await fetch ("http://localhost:3000/products")
            const res = await response.json()
            setProducts(res)
        } catch (error){
            console.log(error)
        }

    }
        fetchAllProducts();
}, []);


useEffect(() => {
    if (searchTerm.trim() === "") {
        setFilteredResults([]);
    } else {
        const lowerSearch = searchTerm.toLowerCase();
        const filtered = products.filter(product => product.title.toLowerCase().includes(lowerSearch));
        setFilteredResults(filtered);
    }
}, [searchTerm, products]);


return (

<div>

    <div className="searchBar">
        <h1>Search for a Product</h1>
        <input 
            id = "searchInput"
            type = "text"
            placeholder = "Enter search term"
            value = {searchTerm}
            onChange = {e => setSearchTerm(e.target.value)}
        />
        <div id="searchResults">
            {filteredResults.map(product => (
                <h3 key={product.id}>{product.title}</h3>
            ))}
        </div>
    </div>

    <div className="productDisplay">
            {products &&
                products.map((product) => 
                    <div key={product.id}>
                        <h1>{product.title}</h1>
                        <img src={product.image_url} alt={product.title}/>
                        <button 
                            onClick={() => navigate(`/products/${product.id}`)} >
                            See Product Details
                        </button>
                    </div>
                )
            }
    </div>

</div>




    )
}

export default ProductList