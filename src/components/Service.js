import icon1 from "../images/icon1.png"
import icon2 from "../images/icon2.png"
import icon3 from "../images/icon3.webp"
import infinite_loop2 from "../images/infinite_loop2.jpg"
import Footer from "./footer"
import Navbar from "./Navbar"

function Service() {
    return (
        <div>
            <Navbar />
            <img src={infinite_loop2} className="infinite-photo-grid" alt="Food" />
            <div className="a1">
                <div className="icon1">
                    <img src={icon1} className="icon" alt="Food" />
                </div>
                <div style={{ color: 'black' }} className="text1">
                    <p style={{ fontSize: 20 }}>You're in a rush and need something from one of the stores on Campus? Mav Market is here! Campus businesses offer a wide range of products for you that you can grab.<br />You're moving out, and need to sell things from your apartment? Mav Market is the place for you. Upload pictures and information about the product, and everyone on the campus will be a prospective buyer.</p>
                </div>
            </div>

            <div className="a2">
                <div className="icon2">
                    <img src={icon2} className="icon" alt="Club" width="220" height="200" />
                </div>
                <div style={{ color: 'black' }} className="text2">
                    <p style={{ fontSize: 20 }}>Be a part of the activities going on on-Campus. Engage with other students with similar interests by using our Club functionality. Posts help you to find new and interesting content every day!</p>
                </div>
            </div>

            <div className="a1">
                <div className="icon1">
                    <img src={icon3} className="icon" alt="Food" width="220" height="200" />
                </div>
                <div style={{ color: 'black' }} className="text1">
                    <p style={{ fontSize: 20 }}>Many on Campus Businesses like Starbucks, Chick-fil-a, Bookstore etc have their products advertised just for you. Take advantage of the networking opportunities by using our Chat functionality. (in development)</p>
                </div>
            </div>
            <Footer />
        </div>
    )
}
export default Service