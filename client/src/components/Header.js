import React, { useState, useEffect, useContext } from 'react';
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Person } from 'react-bootstrap-icons';
import "../styles/general.css";
import "../styles/header.css";
import HeaderContext from '../context/HeaderContext';
import axios from "axios";
//logic for removing username
import { useDispatch } from 'react-redux';
import { setUsername } from '../slices/usernameSlice';
//bootstrap icon
import { RCircle } from 'react-bootstrap-icons';

function Header() {
    const dispatch = useDispatch();
    const location = useLocation().pathname;
    const navigate = useNavigate();
    const { headerUpdate, setHeaderUpdate } = useContext(HeaderContext);
    const [loggedIn, setLoggedIn] = useState();
    const [logoutFormVisible, setLogoutFormVisible] = useState(false);
    const [visibleTransition, setVisibleTransition] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [logoutError, setLogoutError] = useState(false);

    const cookieCheck = async () => {
        try {
            await axios.get("https://meditrack-bw3b.onrender.com/checkAuth/", { withCredentials: true });
            setLoggedIn(true);
            let username = await axios.get("https://meditrack-bw3b.onrender.com/users/get-username", {withCredentials: true});
            if (username.data.length > 16) {
                dispatch(setUsername(`${username.data.slice(0, 16)}..`));
            } else {
                dispatch(setUsername(username.data));
            }
        } catch (err) {
            setLoggedIn(false);
        }
    };

    const handleLogout = () => {
        if (!logoutFormVisible) {
            setLogoutFormVisible(true);
            setTimeout(() => {
                setVisibleTransition(true);
            }, 100)
        } else {
            hideLogoutForm();
        }
    };

    const handleActualLogout = async () => {
        try {
            await axios.get("https://meditrack-bw3b.onrender.com/users/logout", { withCredentials: true });
            hideLogoutForm();
            dispatch(setUsername("")); 
            setTimeout(() => {
                setHeaderUpdate(prev => !prev);
                navigate("/")
            }, 200);
        } catch (err) {
            setLogoutError(true);
        }
    };

    const hideLogoutForm = () => {
        setVisibleTransition(false);
        setTimeout(() => {
            setLogoutFormVisible(false);
            if (logoutError) {
                setLogoutError(false);
                setHeaderUpdate(prev => !prev);
            }
        }, 100);
    }

    useEffect(() => {
        cookieCheck();
    }, [headerUpdate])

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        }

    }, []);

    return (
        <>
            <header>
                <h3 className='page-title nunito-sans'>MediTrack <RCircle id="r-circle" /></h3>
                <nav>
                    <ul className='nav-ul'>
                        {!loggedIn && (
                            <>
                                <li className={location == "/" ? "blackground" : ""} onClick={hideLogoutForm}><Link to="/">Home</Link></li>
                                <li className={location == "/about" ? "blackground" : ""} onClick={hideLogoutForm}><Link to="/about">About us</Link></li>
                                <li className={location == "/signup" ? "blackground" : ""} data-testid="header-sign-up"><Link to="/signup">Sign up</Link></li>
                                <li className={location == "/login" ? "blackground" : ""}><Link to="/login">Log in</Link></li>
                            </>
                        )}
                        {loggedIn && (
                            <>

                                <li className={location == "/profile" || location == "/getting-started" ? "blackground" : ""} onClick={hideLogoutForm}><Link to="/profile"><Person id="person-circle" />Profile</Link></li>
                                <li className={location == "/about" ? "blackground" : ""} onClick={hideLogoutForm}><Link to="/about">About us</Link></li>
                                <div className='logout'>
                                    <li onClick={handleLogout} className={logoutFormVisible ? "blackground" : ""} id={logoutFormVisible && screenWidth > 480 && screenWidth <= 769 ? "logout-button" : ""} ><Link>Logout</Link></li>
                                    {logoutFormVisible && (
                                        <div className={`logout-background ${visibleTransition ? "visible" : ""}`}>
                                            {!logoutError && (
                                                <>
                                                    <h3>Are you sure you want to log out?</h3>
                                                    <div className='logout-cancel'>
                                                        <p className='confirm-logout' data-testid="confirm-logout-button" onClick={handleActualLogout}>Confirm</p>
                                                        <p className="confirm-cancel" onClick={hideLogoutForm}>Cancel</p>   
                                                    </div>
                                                </>
                                            )}
                                            {logoutError && ( 
                                                <>
                                                    <h3>An error has occured.</h3>
                                                    <div className='logout-cancel'>
                                                        <p className="confirm-cancel" onClick={hideLogoutForm}>Cancel</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                    </ul>
                </nav>
            </header>
            <main className='main-background'>
                <Outlet />
            </main>
        </>
    )
}

export default Header
