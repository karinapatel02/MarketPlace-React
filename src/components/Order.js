import React, { useState, useEffect, useContext } from 'react';
import { Link, useMatch, useResolvedPath, useNavigate } from "react-router-dom";
import Oreo from "../images/oreo.webp";
import Psl from "../images/psl.webp";
import Footer from './footer';
import { axiosconn, userCon } from "../util/usercontext";

function Order() {
    const { user, logout } = useContext(userCon);
    const navigate = useNavigate();
    const onlogout = (e) => {
        logout();
    };
    const [orderhistoryData, setOrderData] = useState([]);
    useEffect((i) => {
        getOrderhistory()
    }, []);
    const getOrderhistory = async () => {
        const loginToken = localStorage.getItem('token');
        if (loginToken) {
            const ipdata = JSON.stringify({ uid: user.uid })
            const { data } = await axiosconn.post('getOrderhistory', ipdata, {
                headers: {
                    'Authorization': 'Bearer ' + loginToken,
                }
            });
            if (data.success && data.res) {
                setOrderData(data.res);
                console.log(orderhistoryData);
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
            <div className="content" style={{ overflowX: 'auto' }}>
                <table>
                    <caption><h1>Previous Orders</h1></caption>
                    <tr>
                        <th>No.</th>
                        <th>Date</th>
                        <th>Total</th>
                    </tr>
                    {orderhistoryData.map((item, index) => (
                        <tr>
                            <td>{index + 1}</td>
                            <td>{item.date}</td>
                            <td>${item.productprice * item.quantity}</td>
                        </tr>
                    ))}
                </table>
            </div>
            <div id="footer" style={{ position: 'absolute'}} className="footer">
                <div className="footer-left">
                    <h2>Office Address</h2>
                    <p>701 S. Nedderman Drive <br />
                        Arlington, TX 76019 <br />
                        817-272-2090</p>
                    <address>
                        Email: <a target="popup" href="mailto:mavmarket@uta.edu">mavmarketplace@uta.edu</a><br />
                    </address>
                </div>
                <div className="footer-right">
                    <p>Copyright &copy; 2022 <a href="/">
                        Mav Market</a><br />
                        Part of CSE 5335 002 Web Data Management</p>
                </div>
            </div>
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

export default Order