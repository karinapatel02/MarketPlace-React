import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/homestyle.css';
import '../css/loginstyle.css';
import Footer from './footer';
import Navbar from './Navbar';
import { userCon } from '../util/usercontext';

function Register() {
    const navigate = useNavigate();
    const {registerNewUser, waitPeriod} = useContext(userCon);
    const [registerForm, setFormData] = useState({
        username:'',
        email:'',
        password:'',
        fname:'',
        lname:'',
        pnumber:'',
        role:'student'
    });

    const onChange = (e) => {
        setFormData({
            ...registerForm,
            [e.target.name]:e.target.value
        })
    }

    const register = async (e) => {
        e.preventDefault();
        console.log(registerForm);
        const data = await registerNewUser(registerForm);
        if(data.success){
            e.target.reset();
            alert('You have successfully registered.');
            navigate("/login");
        }
        else if(!data.success && data.message){
            alert(data.message);
        }
        
    }
    return (
        <div>
            <Navbar />
            <div className="row">
                <div className="register">
                    <p className="title" align="center">REGISTER</p>
                    <form onSubmit={register}>
                        <input name="fname" type="text" align="center" required placeholder="First Name" onChange={onChange}/>
                        <input name="lname" type="text" align="center" required placeholder="Last Name" onChange={onChange}/>
                        <input name="email" type="email" align="center" required placeholder="Email" onChange={onChange}/>
                        <input name="username" type="text" align="center" required placeholder="Username" onChange={onChange}/>
                        <input name="password" type="password" align="center" required placeholder="Password" onChange={onChange}/>
                        <input name="pnumber" type="text" align="center" required placeholder="Phone Number" onChange={onChange}/>
                        <select name="role" align="center" required placeholder="Role" value={registerForm.role} onChange={onChange}>
                            <option value="student">Student</option>
                            <option value="business_owner">Business Owner</option>
                        </select>
                        <input type="submit" disabled={waitPeriod} className="regsubmit" align="center" value="REGISTER" />
                    </form>
                </div>
            </div>
            <Footer style={{ position: 'absolute' }} />
        </div >
    )
}
export default Register;