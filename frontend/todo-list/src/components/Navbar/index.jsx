import React from "react";
import { useNavigate } from "react-router-dom";
import './navbar_styles.css';
import { useAuth } from '../AuthProvider'; 

const Navbar = ({ handleOpenLogin }) => {
    const navigate = useNavigate();
    const auth = useAuth();

    const handleLogout = () => {
        auth.logout();             
        navigate('/'); 
        console.log("User logged out");
    };
    
    return (
        <div className="nav">
            <div className="bars"></div>
            <div className="nav-menu">
                <a href="/" className="nav-link">
                    TODO list
                </a>
                {/* <a href="/Scheduled" className="nav-link">
                    Scheduled
                </a>
                <a href="/All Tasks" className="nav-link">
                    All Tasks
                </a> */}
            </div>
            <div className="nav-btn">
            {auth.userName ? (
              <>
                <span className="nav-username">👤 {auth.userName}</span>
                <button className="logout-btn-link" onClick={handleLogout}>
                  Log Out
                </button>
              </>
            ) : (
              <button className="nav-btn-link" onClick={handleOpenLogin}>
                Log In / Sign Up
              </button>
            )}
          </div>
        </div>
    );
};

export default Navbar;
