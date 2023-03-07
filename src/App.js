import React, { useContext } from 'react';
import './css/homestyle.css';
import './css/pagestyle.css';
import Register from "./components/register";
import Login from "./components/signin";
import Forgot from './components/forgot';
import SchoolAdmin from './components/schooladmin';
import SuperAdmin from './components/superadmin';
import ManageStudent from './components/managestudent';
import ManageBusiness from './components/managebusiness';
import StudentDash from "./components/student_dash";
import Profile from "./components/profile";
import BusinessDash from "./components/business_dash";
import Business from "./components/business";
import Home from "./components/Home";
import About from "./components/About";
import Service from "./components/Service";
import Contact from "./components/Contact";
import Ad from "./components/Ad";
import Order from "./components/Order"
import Club from "./components/Club";
import Cart from "./components/Cart";
import Product from "./components/Product";
import Navbar from "./components/Navbar";
// import Footer from './components/footer';
import { Route, Routes } from 'react-router-dom';
import AddProduct from './components/addProduct';
import CreateClub from './components/createClub';
import AddAd from './components/addAd';
import NotFound from './components/NotFound';
import { userCon } from './util/usercontext';
import EditProfile from './components/editProfile';
import EditBusiness from './components/editBusiness';
import ListProducts from './components/ListProducts';

const App = () => {
  document.title = "MavMarket";
  const { user } = useContext(userCon);
  return (

    // <>
    //     <ListUser />
    // </>

    <>
      {/* <Navbar/> */}
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/About" element={<About />} />
          <Route path="/Service" element={<Service />} />
          <Route path="/contact" element={<Contact />} />
          {user && <Route path="/Ad" element={<Ad />} />}
          {user && user.role_type != 'student' && <Route path="/AddAd" element={<AddAd />} />}
          {user && user.role_type == 'student' && <Route path="/Order" element={<Order />} />}
          {user && <Route path="/Club" element={<Club />} />}
          {user && <Route path="/createClub" element={<CreateClub />} />}
          {user && <Route path="/Cart" element={<Cart />} />}
          {user && <Route path="/Product" element={<Product />} />}
          {user && <Route path="/AddProduct" element={<AddProduct />} />}
          <Route path="/login" element={<Login />} />
          {user && user.role_type == 'super_admin' && <Route path="/admin" element={<SuperAdmin />} />}
          {user && (user.role_type == 'super_admin' || user.role_type == 'school_admin') && <Route path="/manageStudent" element={<ManageStudent />} />}
          {user && (user.role_type == 'super_admin' || user.role_type == 'school_admin') && <Route path="/manageBusiness" element={<ManageBusiness />} />}
          {user && user.role_type == 'student' && <Route path="/student" element={<StudentDash />} />}
          {user && user.role_type == 'student' && <Route path="/profile" element={<Profile />} />}
          {user && user.role_type == 'business_owner' && <Route path="/business" element={<BusinessDash />} />}
          {user && user.role_type == 'business_owner' && <Route path="/businessProfile" element={<Business />} />}
          {user && user.role_type == 'school_admin' && <Route path="/school" element={<SchoolAdmin />} />}
          {user && <Route path="/editProfile" element={<EditProfile />} />}
          {user && <Route path='/editBusiness' element={<EditBusiness />} />}
          {user && <Route path='/products' element={<ListProducts />} />}
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {/* <Footer/> */}
    </>

  );
}

export default App;