import { Link } from 'react-router-dom';

function NavBar({token, setToken}){
    const handleLogout = () =>{
        setToken(null);
        localStorage.removeItem('token')
    }

    return(
    <div>
        <nav>
            <h1> Coffee </h1>
            <div>
                <Link to="/">Home</Link>
                {token ? (
                    <>
                    <Link to="/account">Account</Link>
                    <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                    <Link to="/">Products</Link>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    </div>
    )
}

export default NavBar