import './style.css'

function Booking() {
    return(
        <div className="login-page">
            <div className='login-navbar'>
                <a className='link' href='/login'><button className="login-button">Captain Login</button></a>
                <a className='link' href='/admin'><button className="login-button">Admin Login</button></a>
            </div>
            <div className='booking-section'>
                <a className='link' href='/customer'>
                <button className='booking-button'>Book Ambulance</button>
                </a>
            </div>
        </div>
    )
}

export default Booking
