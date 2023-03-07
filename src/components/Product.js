import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from "react-router-dom";
import Footer from "./footer";
import { axiosconn, userCon } from "../util/usercontext";

function Product() {
    const { user, logout } = useContext(userCon);
    const location = useLocation();
    const pid = location.state;
    const onlogout = (e) => {
        logout();
    };
    const [productData, setProuctData] = useState([]);
    useEffect(() => {
        getProduct()
    }, []);
    const getProduct = async () => {
        const loginToken = localStorage.getItem('token');
        if (loginToken) {
            const ipdata = JSON.stringify({ productid: pid })
            const { data } = await axiosconn.post('getProduct', ipdata, {
                headers: {
                    'Authorization': 'Bearer ' + loginToken,
                }
            });
            if (data.success && data.res) {
                setProuctData(data.res);
            }
        }
    }
    return (
        <div>
            <nav className="header">
                <Link to="/" className="site-title" style={{ fontWeight: 'bold', color: 'white', fontSize: 30 }}>Mav Market</Link>
                <div className="dropdown" >
                    <i className="ggprofile"></i>
                    <div className="dropdownContent">
                        <a href="/profile">Profile</a>
                        <a href="/cart">Cart</a>
                        <a href="/order">Orders</a>
                        <a href="/products">Products</a>
                        <a href="/addproduct">Add Product</a>
                        <a href="/login" onClick={onlogout}>Logout</a>
                    </div>
                </div>
                <div className="header-right">
                    <a href="/home" style={{ color: 'white' }} >Home</a>
                    <a href="/about" style={{ color: 'white' }} >About</a>
                    <a href="/service" style={{ color: 'white' }} >Service</a>
                    <a href="/" style={{ color: 'white' }} >Blog</a>
                    <a href="/contact" style={{ color: 'white' }} >Contact</a>
                    <a href="/login" style={{ color: 'white' }} >Login/Register</a>
                </div>
            </nav>
            <div className="content" style={{ height: '115vh' }}>
                <div className="product-info">
                    <h2>{productData.name}</h2>
                    <img src={productData.image} alt="" style={{ width: '100%' }} />
                    <p className="price">{productData.price}</p>
                    <p>{productData.description}</p>
                    <p>By: <u><Link to="/businessprofile">UTA Market</Link></u></p>
                    <form style={{ justifyContent: 'center' }}>
                        <div style={{ paddingRight: 80 }} >
                            <p><input type="number" name="Quantity" placeholder="Quantity" /></p>
                        </div>
                        <p><button type="submit">Add to Cart</button></p>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Product