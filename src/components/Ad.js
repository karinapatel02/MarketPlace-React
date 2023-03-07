import React, { useState, useContext, useEffect } from 'react';
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import Footer from './footer';
import { axiosconn, userCon } from "../util/usercontext";

function Ad() {
    const navigate = useNavigate();
    const { user, logout } = useContext(userCon);
    const onlogout = (e) => {
        logout();
    };
    const [adData, setAdData] = useState([]);
    useEffect(() => {
        getAd()
    }, []);
    const getAd = async () => {
        const loginToken = localStorage.getItem('token');
        if (loginToken) {
            if (user.role_type == 'business_owner') {
                const ipdata = JSON.stringify({ uid: user.uid });
                const { data } = await axiosconn.post('getAddByUser', ipdata, {
                    headers: {
                        'Authorization': 'Bearer ' + loginToken,
                    }
                });
                if (data.success && data.res) {
                    setAdData(data.res);
                }
            } else {
                const { data } = await axiosconn.get('getAds', {
                    headers: {
                        'Authorization': 'Bearer ' + loginToken,
                    }
                });
                if (data.success && data.res) {
                    setAdData(data.res);
                }
            }
        }
    }

    const deleteAd = async (adId) => {
        const loginToken = localStorage.getItem('token');
        if (loginToken) {
            const ipdata = JSON.stringify({ adid: adId });
            const { data } = await axiosconn.post('deleteAd', ipdata, {
                headers: {
                    'Authorization': 'Bearer ' + loginToken,
                }
            });
            if (data.success) {
                alert(data.message);
                window.location.href = window.location.href;
            } else {
                alert(data.message);
            }
        }
    }

    return (
        <div>
            <nav className="header">
                <Link to="/" className="site-title" style={{ fontWeight: 'bold', color: 'white', fontSize: 30 }}>Mav Market</Link>
                <div className="dropdown" >
                    <i className="ggprofile"></i>
                    {user && user.role_type == 'student' && <div className="dropdownContent">
                        <a href="/profile">Profile</a>
                        <a href="/cart">Cart</a>
                        <a href="/order">Orders</a>
                        <a href="/products">Products</a>
                        <a href="/addproduct">Add Product</a>
                        <a href="/login" onClick={onlogout}>Logout</a>
                    </div>}
                    {user && user.role_type == 'business_owner' && <div className="dropdownContent">
                        <a href="/businessprofile">Profile</a>
                        <a href="/products">Products</a>
                        <a href="/addproduct">Add Product</a>
                        <a href="/addad">Add Ad</a>
                        <a href="/login" onClick={onlogout}>Logout</a>
                    </div>}
                    {user && (user.role_type == 'super_admin' || user.role_type == 'school_admin') && <div className="dropdownContent">
                        <a href="/managebusiness">Manage Business</a>
                        <a href="/managestudent">Manage Student</a>
                        <a href="/products">Products</a>
                        <a href="/addproduct">Add Product</a>
                        <a href="/addad">Add Ad</a>
                        <a href="/login" onClick={onlogout}>Logout</a>
                    </div>}
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
            <div className="content row">
                {adData.length > 0 && adData.map((item, index) => (
                    <div className="product-info">
                        <h2>{item.name}</h2>
                        <img src={item.image} alt="" style={{ width: "100%" }} />
                        <p>{item.content}</p>
                        {user && user.role_type != 'student' && <button onClick={() => deleteAd(item.ad_id)} className='submit'>Delete Advertisement</button>}
                        <br />
                    </div>
                ))}
                {adData.length <= 0 && <div align="center"> No Data To Display!!!</div>}
            </div>
            <Footer />
        </div>
    )
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
    return (
        <ul className={isActive === to ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </ul>
    )
}

export default Ad