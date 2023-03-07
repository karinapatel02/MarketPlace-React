import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import '../css/homestyle.css';
import '../css/pagestyle.css';
import '../css/chartstyle.css';
import Footer from './footer';
import { userCon, axiosconn } from '../util/usercontext';

function SchoolAdmin() {
    const { user, logout } = useContext(userCon);
    const onlogout = (e) => {
        logout();
    };
    const getColor = () => {
        return "#" + ((1 << 24) * Math.random() | 0).toString(16);
    }
    // const pie = ["#8884d8", "#82ca9d", "#FFBB28", "#FF8042", "#AF19FF"];
    const CustomTooltip = ({ active, payload, label }) => {
        if (active) {
            return (
                <div
                    className="custom-tooltip"
                    style={{
                        backgroundColor: "#ffff",
                        padding: "5px",
                        border: "1px solid #cccc"
                    }}
                >
                    <label>{`${payload[0].name} : ${payload[0].value}%`}</label>
                </div>
            );
        }
        return null;
    };
    const [stuData, setStuData] = useState([]);
    const [countData, setCountData] = useState({
        student: 0,
        business: 0,
        club: 0,
        school: 0,
        chart1: [],
        pie: []
    });
    useEffect(() => {
        async function asyncCall() {
            await getAllData();
        }
        asyncCall();
    }, []);
    const getAllData = async () => {
        const loginToken = localStorage.getItem('token');
        if (loginToken) {
            await axiosconn.get('getStuUsers', {
                headers: {
                    'Authorization': 'Bearer ' + loginToken,
                }
            }).then(function (response) {
                const res = response.data;
                if (res.success && res.res) {
                    setStuData(res.res);
                }
            })
                .catch(function (error) {
                    console.log(error);
                });

            await axiosconn.get('getCounts', {
                headers: {
                    'Authorization': 'Bearer ' + loginToken,
                }
            }).then(function (response) {
                const res2 = response.data;
                if (res2.success && res2.res) {
                    const count = {};
                    res2.res.forEach(item => {
                        if (item.role == 'student') {
                            count['student'] = item.count;
                        } else {
                            count['business'] = item.count;
                        }
                    });
                    count['club'] = res2.clubs[0].count;
                    count['school'] = res2.schools[0].count;
                    count['chart1'] = res2.cchart;
                    count['pie'] = res2.pie2;
                    setCountData(count);
                }
            })
                .catch(function (error) {
                    console.log(error);
                });

        }
    }
    return (
        <div>
            <nav className="header">
                <Link to="/" className="site-title" style={{ fontWeight: 'bold', color: 'white', fontSize: 30 }}>Mav Market</Link>
                <div className="dropdown" >
                    <i className="ggprofile"></i>
                    <div className="dropdownContent">
                        <a href="/managebusiness">Manage Business</a>
                        <a href="/managestudent">Manage Student</a>
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
            <div className="content" style={{ height: "auto" }}>
                <div className="content-header">
                    <h2>Welcome, {user.fname}!</h2>
                </div>
                <div className="row1">
                    <div className="card">
                        <div className="club-row">
                            <div className="club-column">
                                <div className="club" style={{ background: "linear-gradient(to right, #b7d3de , #edb4ca)" }}>
                                    <h3>Students</h3>
                                    <p>{countData.student}</p>
                                </div>
                            </div>
                            <div className="club-column">
                                <div className="club" style={{ background: "linear-gradient(to right, #b7d3de , #edb4ca)" }}>
                                    <h3>Business Owners</h3>
                                    <p>{countData.business}</p>
                                </div>
                            </div>
                            <div className="club-column">
                                <div className="club" style={{ background: "linear-gradient(to right, #b7d3de , #edb4ca)" }}>
                                    <h3>Clubs</h3>
                                    <p>{countData.club}</p>
                                </div>
                            </div>
                            <div className="club-column">
                                <div className="club" style={{ background: "linear-gradient(to right, #b7d3de , #edb4ca)" }}>
                                    <h3>Schools</h3>
                                    <p>{countData.school}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row1">
                        <div className="column-left">
                            <h1>Top 5 Student Clubs</h1>
                            {countData.chart1.map((item, index) => (
                                <div>
                                    <p>{item.name}</p>
                                    <div className="bargraph">
                                        <div className="bars" style={{ width: item.pct, backgroundColor: getColor() }}>{item.pct}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="column-right">
                            <h1>Number of Students Per Major</h1>
                            <PieChart width={800} height={400} style={{ marginLeft: '-12em' }}>
                                <Pie
                                    data={countData.pie}
                                    color="#000000"
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={150}
                                    fill="#8884d8"
                                >
                                    {countData.pie.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={getColor()}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                            </PieChart>
                        </div>
                    </div>
                    <div className="row1">
                        <table>
                            <caption><h1>Student Details</h1></caption>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Major</th>
                                    <th>School</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stuData.map((item, index) => (
                                    <tr className="trb">
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>{item.phone_number}</td>
                                        <td>{item.city}</td>
                                        <td>{item.state}</td>
                                        <td>{item.major}</td>
                                        <td>{item.school}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </div >
    )
}
export default SchoolAdmin;