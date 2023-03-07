import React, { useEffect, useState, useContext } from 'react';
import { axiosconn, userCon, UserProvider } from "../util/usercontext";
import { Link, useNavigate } from 'react-router-dom';
import '../css/homestyle.css';
import '../css/pagestyle.css';
import Footer from './footer';
import croissant from '../images/croissant.jpeg';
import psl from '../images/psl.webp';
import cakepop from '../images/cakepop.jpeg';
import pslad from '../images/pslad.png';

function BusinessDash() {
    const { user } = useContext(userCon);
    const navigate = useNavigate();
    const getDetails = async () => {
        try {
            const { data } = await axiosconn.get('businessdash', {
                params: {
                    'id': user.uid
                }
            });
            console.log(data);
            if (data.success && data.deets) {
                setDetails(data);
                console.log(details);
            }
        } catch (err) {
            console.log(err);
        }
    };
    const [details, setDetails] = useState([]);
    useEffect(() => {
        getDetails();
    }, []);

    const onlogout = (e) => {
        e.preventDefault();
        navigate("/login");
    };
    return (
        <div>
            <nav className="header">
                <Link to="/" className="site-title" style={{ fontWeight: 'bold', color: 'white', fontSize: 30 }}>Mav Market</Link>
                <div className="dropdown" >
                    <i className="ggprofile"></i>
                    <div className="dropdownContent">
                        <a href="/businessprofile">Profile</a>
                        <a href="/products">Products</a>
                        <a href="/addproduct">Add Product</a>
                        <a href="/addad">Add Ad</a>
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
            <div className="content">
                <div className="content-header">
                    <h2>Welcome, {user.fname}!</h2>
                </div>
                <div className="row">
                    <div className="left-column">
                        <div className="card">
                            <h1>Your Products</h1>
                            <div className="product-row">
                            { details.products ? (
                                details.products.map((item, index) => (
                            <div className="product-column">
                                <div className="product">
                                    <Link to="/Product">
                                        {/* <img src={book} alt="book" style={{ width: "100%" }} /> */}
                                        <h3>{item.name}</h3></Link>
                                    <p className="price">{item.price}</p>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                            ))) : 'Nothing to Show'}
                            </div>
                            <div className="add">
                                <Link to="/addProduct"><i className="gg-add"></i></Link>
                            </div>
                        </div>
                    </div>
                    <div className="right-column">
                        <div className="card">
                            <h1>Ads</h1>
                            <div className="posts">
                            { details.ads ? (
                                details.ads.map((item, index) => (
                                    <div className="ad-container">
                                    <a href="/ad">
                                        <img src={pslad} alt="Ad1" style={{ width: "100%" }} />
                                        <div className="ad-overlay"> {item.content}</div></a>
                                </div>
                            ))) : 'Nothing to Show'}
                                <div className="add">
                                    <Link to="/addAd"><i className="gg-add"></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default BusinessDash;