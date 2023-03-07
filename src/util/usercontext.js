import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const userCon = createContext();

export const axiosconn = axios.create({
    baseURL: 'http://localhost:8000/PHP/',
});

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [waitPeriod, setWait] = useState(false);

    const registerNewUser = async (userData) => {
        setWait(true);
        try {
            const ipdata = JSON.stringify(userData);
            console.log(ipdata);
            const { data } = await axiosconn.post('register', ipdata, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setWait(false);
            return data;
        }
        catch (err) {
            setWait(false);
            return { success: 0, message: 'Server Error!' };
        }
    }

    const updatePassword = async (userData) => {
        setWait(true);
        try {
            const ipdata = JSON.stringify(userData);
            console.log(ipdata);
            const { data } = await axiosconn.post('updatePassword', ipdata, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setWait(false);
            return data;
        }
        catch (err) {
            setWait(false);
            return { success: 0, message: 'Server Error!' };
        }
    }

    const login = async (formData) => {
        setWait(true);
        try {
            const ipdata = JSON.stringify(formData);
            console.log(ipdata);
            const { data } = await axiosconn.post('login', ipdata, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            if (data.success && data.token) {
                localStorage.setItem('token', data.token);
                setWait(false);
                return { success: 1 };
            }
            setWait(false);
            return { success: 0, message: data.message };
        }
        catch (err) {
            setWait(false);
            return { success: 0, message: 'Server Error!' };
        }

    }

    const isUserLoggedIn = async () => {
        const loginToken = localStorage.getItem('token');
        if (loginToken) {
            const { data } = await axiosconn.get('getUser', {
                headers: {
                    'Authorization': 'Bearer ' + loginToken,
                }
            });
            if (data.success && data.user) {
                setUser(data.user);
                localStorage.setItem("uid", data.user.uid);
                return data.user;
            }
            setUser(null);
        }
    }

    useEffect(() => {
        async function asyncCall() {
            await isUserLoggedIn();
        }
        asyncCall();
    }, []);

    const logout = () => {
        console.log("logged out");
        localStorage.clear();
        setUser(null);
    }

    return (
        <userCon.Provider value={{ registerNewUser, updatePassword, login, waitPeriod, user, isUserLoggedIn, logout }}>
            {children}
        </userCon.Provider>
    );

}

export default UserProvider;