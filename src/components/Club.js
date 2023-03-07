import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import club from "../images/club.png";
import Avatar from "../images/avatar.png";
import Avatar2 from "../images/avatar2.png";
import Footer from './footer';
import '../css/homestyle.css';
import '../css/loginstyle.css';
import { axiosconn, userCon } from "../util/usercontext";

function Club() {
    const { user, logout } = useContext(userCon);
    const location = useLocation()
    const { clubid } = location.state;
    const navigate = useNavigate();
    const onlogout = (e) => {
        logout();
    };
    const [clubData, setClubData] = useState([]);
    const getClub = async () => {
        const loginToken = localStorage.getItem('token');
        if (loginToken) {
            const ipdata = JSON.stringify({ clubId: clubid })
            const { data } = await axiosconn.post('getClubById', ipdata, {
                headers: {
                    'Authorization': 'Bearer ' + loginToken,
                }
            });
            if (data.success) {
                setClubData(data);
                console.log(clubData);
            }
        }
    }
    const joinClub = async (e) => {
        const loginToken = localStorage.getItem('token');
        try {
            if (loginToken) {
                const ipdata = JSON.stringify({ clubid: clubid, uid: user.uid })
                const { data } = await axiosconn.post('joinClub', ipdata, {
                    headers: {
                        'Authorization': 'Bearer ' + loginToken,
                    }
                });
                if (data.success) {
                    // e.target.reset();
                    alert("Joined Club Successfully");
                } else {
                    alert(data.message)
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        getClub()
    }, []);

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
                <div className="product-info">

                    <img src={club} className="avicon" alt="" style={{ width: '50%' }} />
                    <h2>{clubData.clubdeets ? clubData.clubdeets['name'] : 'No Club Name'}</h2>
                    <p>Members:</p>
                    {/* <img src={Avatar} alt="Avatar" className="avatar" />
                    <img src={Avatar2} alt="Avatar" className="avatar" />
                    <img src={Avatar} alt="Avatar" className="avatar" />
                    <img src={Avatar2} alt="Avatar" className="avatar" />
                    <img src={Avatar} alt="Avatar" className="avatar" />
                    <img src={Avatar2} alt="Avatar" className="avatar" />
                    <img src={Avatar} alt="Avatar" className="avatar" />
                    <img src={Avatar2} alt="Avatar" className="avatar" /> */}
                    <table>
                        <tbody>
                            {clubData.members ? (
                                clubData.members.map((item, index) => (
                                    <tr className="trb">
                                        <td>{index + 1}</td>
                                        <td>{item.fname + ' ' + item.lname}</td>
                                    </tr>
                                ))) : 'Nothing to Show'}
                        </tbody>
                    </table>
                    <button align="center" onClick={() => joinClub(clubData.club_id)}>JOIN CLUB</button>

                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Club;