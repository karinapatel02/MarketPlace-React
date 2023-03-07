import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosconn, userCon, UserProvider } from "../util/usercontext";


function EditBusiness() {

    const navigate = useNavigate();
    const { user, logout } = useContext(userCon);
    const [updateForm, setFormData] = useState({
        uid: user.uid,
        fname: user.fname,
        lname: user.lname,
        uname: user.username,
        email: user.email,
        phone: user.phone_number,
        city: '',
        state: '',
    });

    const onChange = (e) => {
        setFormData({
            ...updateForm,
            [e.target.name]: e.target.value
        })
    }

    const editprofile = async (e) => {
        e.preventDefault();
        console.log(updateForm);
        try {
            const ipdata = JSON.stringify(updateForm);
            console.log(ipdata);
            const { data } = await axiosconn.post('editbusinessprofile', ipdata, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (data.success) {
                // e.target.reset();
                alert('Details Updated Successfully');
                navigate("/businessProfile");
            }
            else if (!data.success && data.message) {
                alert(data.message);
            }
        }
        catch (err) {
            console.log(err);
            alert('Server Error!');
        }

    }

    const deleteprofile = async (e) => {
        e.preventDefault();
        try {
            const { response } = await axiosconn.post('deletebusinessprofile', {
                params: {
                    'id': user.uid,
                }
            });

            if (response.success) {
                e.target.reset();
                alert('Account Deleted');
                navigate("/signin");
            }
        } catch (err) {
            console.log(err);
        }
    }

    const onlogout = (e) => {
        logout();
    };
    return (
        <div>
            <div className="content row">
                <form className="add-product" onSubmit={editprofile}>
                <div className="form-row">
                        <div className="form-labels">
                            First Name:
                        </div>
                        <div className="form-inputs">
                            <input type="text" id="fname" name="fname" defaultValue={user.fname} onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-labels">
                            Last Name:
                        </div>
                        <div className="form-inputs">
                            <input type="text" id="lname" name="lname" defaultValue={user.lname} onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-labels">
                            Username:
                        </div>
                        <div className="form-inputs">
                            <input type="text" id="uname" name="lname" defaultValue={user.username} onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-labels">
                            Email:
                        </div>
                        <div className="form-inputs">
                            <input type="text" id="email" name="email" defaultValue={user.email} onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-labels">
                            Phone Number:
                        </div>
                        <div className="form-inputs">
                            <input type="text" id="phone" name="phone" defaultValue={user.phone_number} onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-labels">
                            City:
                        </div>
                        <div className="form-inputs">
                            <input type="text" id="city" name="city" onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-labels">
                            State:
                        </div>
                        <div className="form-inputs">
                            <input type="text" id="state" name="state" onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <button className='submit' onClick={editprofile}>Edit Profile</button>
                        <button className='delete' onClick={deleteprofile}>Delete Profile</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditBusiness;