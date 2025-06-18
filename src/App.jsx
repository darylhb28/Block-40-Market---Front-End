import { useState, useEffect } from 'react'
import {Routes, Route} from "react-router-dom"
import Account from './components/Account';
import ProductList from './components/ProductList'
import Login from './components/Login'
import NavBar from './components/NavBar'
import ProductDetails from './components/ProductDetails'
import Register from './components/Register'
import {getToken} from './components/Auth'
import './App.css'

function App() {
  const [token, setToken] = useState(null);

  return (
    <>
      <NavBar token={token} setToken={setToken}/>
      <Routes>
        <Route path="/" element={<ProductList/>}/>
        <Route path="/account" element={<Account/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/products/:id" element={<ProductDetails/>}/>
      </Routes>
    </>
  )
}

export default App
