import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/homestyle.css'
import '../css/pagestyle.css'
import Footer from './footer';
import book from "../images/book.jpeg";
import bottle from "../images/bottle.webp";
import avatar from "../images/avatar.png";
import post2 from "../images/post2.jpeg";
import { axiosconn, userCon, UserProvider } from "../util/usercontext";
import axios from 'axios';


function Profile() {
    const { user } = useContext(userCon);
    const navigate = useNavigate();
    const getDetails= async () => {
        try {
            const { data } = await axiosconn.get('profile', {
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
        // setauthenticated(false);
        // localStorage.setItem("authenticated", false);
        // localStorage.removeItem("uname");
        navigate("/login");
    };

    return (
        <div>

            <nav className="header">
                <Link to="/" className="site-title" style={{ fontWeight: 'bold', color: 'white', fontSize: 30 }}>Mav Market</Link>
                <div className="dropdown" >
                    <i className="ggprofile"></i>
                    <div className="dropdownContent">
                        <a href="/student">DashBoard</a>
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
            <div className="profile-row">
                <div className="profile-left-column">
                    <div className="card">
                        <img src={avatar} className="avicon" alt="profile" />
                        {/* <h2>hello</h2> */}
                        {/* {details.map((stu, key) => <h2 key={key}>hello{stu.city}</h2> )} */}
                        <h1>{details.deets ? details.deets['fname']+' '+details.deets['lname'] : ''}</h1>
                        <h2>{details.school ? details.school['name'] : 'Edit Profile to add School'}</h2>
                        <h3>{details.deets ? details.deets['major'] : 'Edit Profile to add Major'}</h3>
                        <button type="button" className="formboldbtn" onClick={() => navigate("/editProfile")}>Edit Profile</button>
                    </div>
                </div>
                <div className="profile-right-column">
                    <div className="card">
                        <h1>Products by Student</h1>
                        <div className="product-row">
                            { details.products ? (
                                details.products.map((item, index) => (
                            <div className="product-column">
                                <div className="product">
                                    <Link to="/Product"><img src={book} alt="book" style={{ width: "100%" }} />
                                        <h3>{item.name}</h3></Link>
                                    <p className="price">{item.price}</p>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                            ))) : 'Nothing to Show'}
                        </div>
                    </div>
                    <div className="card">
                        <h1>Posts by Student</h1>
                        <div className="post-row">
                            <div className="post-column">
                                <a href="/"> <img src={post2} className="post-img" alt="pancake" style={{ width: "100%" }} /></a>
                                <div className="overlay">Pancakes Around the World</div>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <h1>Clubs</h1>
                        <div className="club-row">
                        { details.ads ? (
                                details.ads.map((item, index) => (
                                    <div className="club-column">
                                    <Link to="/Club"> <div className="club">
                                        <h3>{item.name}</h3>
                                    </div> </Link>
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
export default Profile;

