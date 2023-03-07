import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/homestyle.css'
import '../css/pagestyle.css'
import Footer from './footer';
import snickers from "../images/snickers.jpeg";
import apple from "../images/apple.jpeg";
import book from "../images/book.jpeg";
import bottle from "../images/bottle.webp";
import cakepop from "../images/cakepop.jpeg";
import croissant from "../images/croissant.jpeg";
import ipad from "../images/ipad.jpeg";
import post1 from "../images/post1.jpeg";
import post2 from "../images/post2.jpeg";
import post3 from "../images/post3.jpeg";
import psl from "../images/psl.webp";
import pslad from "../images/pslad.png";
import vstraws from "../images/vstraws.jpg";
import { axiosconn, userCon, UserProvider } from "../util/usercontext";

function StudentDash() {
    const { user } = useContext(userCon);
    const navigate = useNavigate();
    const getDetails= async () => {
        try {
            const { data } = await axiosconn.get('studentdash', {
                params: {
                    'id': user.uid
                }
            });
            console.log(data);
            if (data.success && data.products) {
                setDetails(data);
                console.log(details);
                console.log(details.products);
            } else {
                console.log('not set details');
            }
        } catch (err) {
            console.log(err);
        }
    };

    const addToCart = async (pid) => {
        const loginToken = localStorage.getItem('token');
        try {
            if (loginToken) {
            const ipdata = JSON.stringify({ pid: pid, uid: user.uid })
            const { data } = await axiosconn.post('addToCart', ipdata, {
                headers: {
                    'Authorization': 'Bearer ' + loginToken,
                }
            });
            if (data.success) {
                // e.target.reset();
                alert("Added to Cart");
            } else if (!data.success && data.message) {
                alert(data.message);
            }
        }
    } catch(err) {
        console.log(err);
    }
    }

    const [details, setDetails] = useState([]);
    useEffect(() => {
        getDetails();
    }, []);

    // async function getOrder(){
    //     try {
    //         const {response} = await axiosconn.get('isOrder', {
    //             params: {
    //                 'id': uid,
    //             }
    //         });
    //         console.log(response);
    //         if (response.success && response.order) {
    //             // setStudent(response.student);
    //             console.log(response.order);
    //         }
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
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
            <div className="content">
                <div className="content-header">
                    <h2>Welcome, {user.fname}!</h2>
                </div>
                <div className="row">
                    <div className="left-column">
                        <div className="card">
                            <h1>Browse Products</h1>
                            <div className="product-row">
                            { details.products ? (
                                details.products.map((item, index) => (
                            <div className="product-column">
                                <div className="product">
                                    <Link to="/Product"><img src={item.img} alt={item.name} style={{ width: "100%" }} />
                                        <h3>{item.name}</h3></Link>
                                    <p className="price">{item.price}</p>
                                    <p>{item.description}</p>
                                    <p><button onClick={() => addToCart(item.pid)}>Add to Cart</button></p>
                                </div>
                            </div>
                            ))) : 'Nothing to Show'}
                            </div>

                            <div className="add">
                                <a href="/addproduct"><i className="gg-add"></i></a>
                            </div>
                        </div>
                        <div className="card">
                            <h1>Popular Posts</h1>
                            <div className="post-row">
                                <div className="post-column">
                                    <a href="/"><img src={post1} className="post-img" alt="ipad" style={{ width: "100%" }} /></a>
                                    <div className="overlay">Unboxing iPad Air</div>
                                </div>
                                <div className="post-column">
                                    <a href="/"><img src={post2} className="post-img" alt="pancake" style={{ width: "100%" }} /></a>
                                    <div className="overlay">Pancakes Around the World</div>
                                </div>
                                <div className="post-column">
                                    <a href="/"><img src={post3} className="post-img" alt="halloween" style={{ width: "100%" }} /></a>
                                    <div className="overlay">Halloween 2022 Outfit Ideas</div>
                                </div>
                            </div>
                            <div className="add">
                                <a href="/"><i className="gg-file-add"></i></a>
                            </div>
                        </div>
                    </div>
                    <div className="right-column">
                        <div className="card">
                            <h1>Join Clubs</h1>
                            {/* <div className="club-row">
                                <div className="club-column">
                                    <a href="/club"> <div className="club">
                                        <h3>Koffee With Karan</h3>
                                    </div> </a>
                                </div>
                                <div className="club-column">
                                    <a href="/club"> <div className="club">
                                        <h3>Tau Beta Phi</h3>
                                    </div> </a>
                                </div>
                            </div> */}
                            <div className="club-row">
                            { details.clubs ? (
                                details.clubs.map((item, index) => (
                                    <div className="club-column">
                                    <Link to="/Club" state={{ clubid: item.club_id }}> <div className="club">
                                        <h3>{item.name}</h3>
                                    </div> </Link>
                                </div>
                            ))) : 'Nothing to Show'}
                            </div>
                            <div className="add">
                                <a href="/createclub"><i className="gg-add"></i></a>
                            </div>
                        </div>
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )

}

export default StudentDash;