import React from "react";
import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosconn, userCon } from "../util/usercontext";

function EditProfile() {
    const { user, logout } = useContext(userCon);
    const navigate = useNavigate();
    const [updateForm, setFormData] = useState({
        uid: user.uid,
        fname: user.fname,
        lname: user.lname,
        uname: user.username,
        email: user.email,
        phone: user.phone_number,
        city: '',
        state: '',
        major: '',
        school:''
    });

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
                setFormData({
                    ...updateForm,
                    city: data.deets.city,
                    state: data.deets.state,
                    major: data.deets.major,
                    school: data.deets.school
                })
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
            const { data } = await axiosconn.post('editprofile', ipdata, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (data.success) {
                // e.target.reset();
                alert('Details Updated Successfully');
                navigate("/profile");
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
            const { response } = await axiosconn.post('deleteprofile', {
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
                            <input type="text" id="fname" name="fname" value={updateForm.fname} onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-labels">
                            Last Name:
                        </div>
                        <div className="form-inputs">
                            <input type="text" id="lname" name="lname" value={updateForm.lname} onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-labels">
                            Username:
                        </div>
                        <div className="form-inputs">
                            <input type="text" id="uname" name="uname" value={updateForm.uname} onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-labels">
                            Email:
                        </div>
                        <div className="form-inputs">
                            <input type="text" id="email" name="email" value={updateForm.email} onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-labels">
                            Phone Number:
                        </div>
                        <div className="form-inputs">
                            <input type="text" id="phone" name="phone" value={updateForm.phone} onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-labels">
                            City:
                        </div>
                        <div className="form-inputs">
                            <input type="text" id="city" name="city" value={updateForm.city} onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-labels">
                            State:
                        </div>
                        <div className="form-inputs">
                            <input type="text" id="state" name="state" value={updateForm.state} onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-labels">
                            Major:
                        </div>
                        <div className="form-inputs">
                            <input type="text" id="major" name="major" value={updateForm.major} onChange={onChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-labels">
                            School:
                        </div>
                        <div className="form-inputs">
                        <select name="school" placeholder="School" value={updateForm.school} onChange={onChange}>
                        <option value={updateForm.school}>{details.school ? details.school['name'] : ''}</option>
                        { details.schools ? (
                                details.schools.map((item, index) => (
                                    <option value={item.school_id}>{item.name}</option> 
                            ))) : ''}
                        </select>
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

export default EditProfile;