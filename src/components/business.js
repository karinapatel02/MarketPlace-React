import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosconn, userCon, UserProvider } from "../util/usercontext";
import '../css/homestyle.css';
import '../css/pagestyle.css';
import Footer from './footer';
import avatar2 from "../images/avatar2.png";
import snickers from "../images/snickers.jpeg";
import vstraws from "../images/vstraws.jpg";

function Business() {
    const { user } = useContext(userCon);
    const navigate = useNavigate();
    const getDetails = async () => {
        try {
            const { data } = await axiosconn.get('businessprofile', {
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
    const [details, setDetails] = useState({
        deets: [],
        products: [],
        ads:[]
    });
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
                        <a href="/business">DashBoard</a>
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
            <div className="profile-row">
                <div className="profile-left-column">
                    <div className="card">
                        <img src={avatar2} className="avicon" alt="business" />
                        <h1>{details.deets ? details.deets['fname'] + ' ' + details.deets['lname'] : 'Edit Profile to add Name'}</h1>
                        <h2>{details.deets ? details.deets['city'] : 'Edit Profile to add City'}</h2>
                        <button type="button" className="formboldbtn" onClick={() => navigate("/editBusiness")}>Edit Profile</button>
                    </div>
                </div>
                <div className="profile-right-column">
                    <div className="card">
                        <h1>Products by Business</h1>
                        <div className="product-row">
                            {details.products ? (
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
                    </div>
                    <div className="card">
                        <h1>Ads</h1>
                        <div className="posts">
                            {details.ads ? (
                                details.ads.map((item, index) => (
                                    <div className="ad-container">
                                        <a href="/ad">
                                            {/* <img src={pslad} alt="Ad1" style={{ width: "100%" }} /> */}
                                            <div className="ad-overlay"> {item.content}</div></a>
                                    </div>
                                ))) : 'Nothing to Show'}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Business;