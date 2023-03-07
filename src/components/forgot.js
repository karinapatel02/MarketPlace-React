import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/homestyle.css'
import Footer from './footer';
import Navbar from './Navbar';
import { userCon } from '../util/usercontext';

function Forgot() {
    const navigate = useNavigate();
    const { updatePassword, user } = useContext(userCon);
    const uname = "";
    if (user) {
        uname = user.username;
    }
    const [updateForm, setFormData] = useState({
        username: uname,
        password: ''
    });

    const onChange = (e) => {
        setFormData({
            ...updateForm,
            [e.target.name]: e.target.value
        })
    }

    const update = async (e) => {
        e.preventDefault();
        console.log(updateForm);
        const data = await updatePassword(updateForm);
        if (data.success) {
            e.target.reset();
            alert('You have successfully updated.');
            navigate("/login");
        }
        else if (!data.success && data.message) {
            alert(data.message);
        }

    }
    return (
        <div>
            <Navbar />
            <div className="row" align="center">
                <div className="login">
                    <p className="title" align="center">RESET PASSWORD</p>
                    <form onSubmit={update}>
                        <input className="name" type="text" align="center" required placeholder="Username"
                            onChange={onChange} style={{ marginLeft: "0em" }} name="username" />
                        <input className="newpassword" type="password" align="center" required placeholder="Password"
                            onChange={onChange} style={{ marginLeft: "0em" }} name="password" />
                        <input type="submit" align="center" value="RESET" className="submit" style={{ marginLeft: "0em" }} />
                    </form>
                </div>
            </div>
            <Footer style={{ position: 'absolute' }} />
        </div>
    )
}
export default Forgot;