import React from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink instead of Link
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is loaded
import "./NavHeader.css"; // Import custom CSS

const NavHeader = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-custom">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">
                Smart Face Detector
                </NavLink>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNavAltMarkup" 
                    aria-controls="navbarNavAltMarkup" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <NavLink 
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                            to="/" 
                            end
                        >
                            Home
                        </NavLink>
                        <NavLink 
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                            to="/photo"
                        >
                            Detect from Photo
                        </NavLink>
                        <NavLink 
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                            to="/video"
                        >
                            Detect from Video
                        </NavLink>
                        <NavLink 
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} 
                            to="/RealTimeFaceDetection"
                        >
                            Detect in Real Time
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavHeader;
