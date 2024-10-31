import React, { useEffect, useState, useRef, useContext } from 'react';
import '../styles/gettingStarted.css';
import "../styles/general.css";
//IMAGES
import monkImage from "../images/monk.png";
import beginnerImage from "../images/beginner.png";
import experiencedImage from "../images/intermediate.png";
import timerImage from "../images/timer.png";
//
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
//header context for header reset 
import HeaderContext from '../context/HeaderContext';
//username slice
import { useDispatch, useSelector } from 'react-redux';
import { setUsername } from "../slices/usernameSlice";


function GettingStarted() {

    const infoRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [visibleHeader, setVisibleHeader] = useState(false);
    const [visibleGettingStarted, setVisibleGettingStarted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [canGetUsername, setCanGetUsername] = useState(false);

    const usernameFromSlice = useSelector(state => state.username.username);

    const username = !usernameFromSlice || usernameFromSlice == "User" ? null : usernameFromSlice;

    //state for error
    const [error, setError] = useState("");

    //state for level selected
    const [beginner, setBeginner] = useState(false);
    const [experienced, setExperienced] = useState(false);
    const [monk, setMonk] = useState(false);
    const [visibleInfo, setVisibleInfo] = useState(false);
    const [visibleButton, setVisibleButton] = useState(false);

    //
    const { setHeaderUpdate } = useContext(HeaderContext);

    const getUsernameFromDatabase = async () => {
        if (!username) {
            try {
                let username = await axios.get("http://localhost:7777/users/get-username", { withCredentials: true });
                dispatch(setUsername(username.data));
            } catch (err) {
                dispatch(setUsername("User"));
            }
        }
    };

    const handleLevelSelect = level => {
        setError("");
        setVisibleInfo(false);
        if (level === "beginner") {
            if (beginner) {
                setBeginner(false);
                return;
            }
            setExperienced(false);
            setMonk(false);
            setBeginner(true);

        } else if (level === "experienced") {
            if (experienced) {
                setExperienced(false);
                return;
            }
            setBeginner(false);
            setMonk(false);
            setExperienced(true);
        } else {
            if (monk) {
                setMonk(false);
                return;
            }
            setBeginner(false);
            setExperienced(false);
            setMonk(true);
        }
        setTimeout(() => {
            setVisibleInfo(true);
            infoRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 500);
    };

    const handleContinue = () => {
        setError("");
        if (beginner) {
            setLevel(1)
        } else if (experienced) {
            setLevel(2);
        } else {
            setLevel(3);
        }
    };


    const setLevel = async level => {
        try {
            await axios.post("http://localhost:7777/level/set-level", { level }, { withCredentials: true });
            navigate("/profile");
        } catch (err) {
            if (err.response?.status == 500) {
                setError("Internal server error.");
            } else if (err.response?.status == 401) {
                setError("Unauthorized, please try logging in again.");
                setHeaderUpdate(prev => !prev);
            } else {
                setError("An error has occured.");
            }
        }
    };

    const levelExistsCheck = async () => {
        try {
            let usersLevel = await axios.get("http://localhost:7777/level/check-level", { withCredentials: true });
            if (usersLevel.data) {
                navigate("/profile");
            } else return;
        } catch (err) {
            navigate("/login");
        }
    };

    const checkAuth = async () => {
        try {
            await axios.get("http://localhost:7777/checkAuth", { withCredentials: true });
            setCanGetUsername(true);
        } catch (err) {
            dispatch(setUsername(""));
            navigate("/login");
        }
    }

    useEffect(() => {
        checkAuth();
    }, []);

    useEffect(() => {
        if (canGetUsername && !username) {
            getUsernameFromDatabase();
        } else if (canGetUsername && username) {
            levelExistsCheck();
            setLoading(false);
        }
    }, [canGetUsername, username]);

    useEffect(() => {
        if (!loading) {
            setTimeout(() => {
                setVisibleHeader(true);
            }, 100)
        }
    }, [loading]);

    useEffect(() => {
        if (visibleHeader) {
            setTimeout(() => {
                setVisibleGettingStarted(true);
            })
        }
    }, [visibleHeader]);

    useEffect(() => {
        if (visibleInfo) {
            setTimeout(() => {
                setVisibleButton(true)
            }, 300)
        } else {
            setVisibleButton(false);
        }
    }, [visibleInfo]);




    return (
        <div style={{ color: "white" }} className='getting-started-component'>
            {loading && (
                <div className='loader' data-testid="loader"></div>
            )}
            {username && !loading && (
                <>
                    <header>
                        <h1 className={`welcome-header ${visibleHeader ? "visible1" : ""}`}>Welcome, {username}!</h1>
                    </header>
                    <main>
                        <section className={`getting-started1 ${visibleGettingStarted ? "visible1" : ""}`}>
                            <h2 id="getting-started-header1">What would you consider your current meditation level to be?</h2>
                            <div className='starting-levels1' aria-label='Levels to choose from upon creating an account.'>
                                <div className={`beginner1 ${beginner ? "selected-level" : ""}`} data-testid="beginner-level" onClick={() => handleLevelSelect("beginner")}>
                                    <img src={beginnerImage} alt="Icon representing a beginner level" />
                                    <h3>Beginner</h3>
                                    <p>Little to no mediation experience.</p>
                                </div>
                                <div className={`experienced1 ${experienced ? "selected-level" : ""}`} data-testid="experienced-level" onClick={() => handleLevelSelect("experienced")}>
                                    <img src={experiencedImage} alt="Icon representing an experienced level" />
                                    <h3>Experienced</h3>
                                    <p>Practices meditation frequently.</p>
                                </div>
                                <div className={`monk1   ${monk ? "selected-level" : ""}`} data-testid="monk-level" onClick={() => handleLevelSelect("monk")}>
                                    <img src={monkImage} alt="Icon representing an experienced level" />
                                    <h3>Monk</h3>
                                    <p>An expert at <br /> meditation.</p>
                                </div>
                            </div>
                        </section>
                        {beginner && (
                            <div className={`beginner1-info ${visibleInfo ? "visible1" : ""}`} aria-label="Information about the beginner program" ref={infoRef}>
                                <h2>Beginner</h2>
                                <p>As a beginner, you are likely new to meditation, start <strong>slow </strong> and try to enjoy the process.</p>
                                <div className='beginner1-timer'>
                                    <img className="timer-icon" src={timerImage} alt="Icon that represents a Timer" />
                                    <p>You can time every meditation session, and your progress will be saved to your progress for the week! </p>
                                </div>
                                <p>You will have to complete 5 hours (or 300 minutes) of meditation before progressing to the next level.</p>
                            </div>
                        )}
                        {experienced && (
                            <div className={`beginner1-info ${visibleInfo ? "visible1" : ""}`} aria-label="Information about the experienced program" ref={infoRef}>
                                <h2>Experienced</h2>
                                <p>As an experienced meditator, you likely practice meditation <strong>regularly</strong>, most days of the week.</p>
                                <div className='beginner1-timer'>
                                    <img className="timer-icon" src={timerImage} alt="Icon that represents a Timer" />
                                    <p>You can time every meditation session, and your progress will be saved to your progress for the week! </p>
                                </div>
                                <p>You will have to complete 20 hours (or 1200 minutes) of meditation before progressing to the next level.</p>
                            </div>
                        )} 
                        {monk && (
                            <div className={`beginner1-info ${visibleInfo ? "visible1" : ""}`} aria-label="Information about the monk program!" ref={infoRef}>
                                <h2>Monk</h2>
                                <p>At this point, meditation should be a <strong>lifestyle</strong> for you!</p>
                                <div className='beginner1-timer'>
                                    <img className="timer-icon" src={timerImage} alt="Icon that represents a Timer" />
                                    <p>You can time every meditation session, and your progress will be saved to your progress for the week!</p>
                                </div>
                                <p>This is the highest level achievable, just try to stay strong and consistent!</p>
                            </div>
                        )}
                        {(beginner || experienced || monk) && (
                            <div className={`continue-button ${visibleButton ? "visible1" : ""}`}>
                                {error !== '' && (
                                    <div id="error">
                                        <p id="error">{error}</p>
                                    </div>
                                )}
                                <button type="button" onClick={handleContinue} data-testid='continue-button'>Continue as {beginner ? "Beginner" : ""} {experienced ? "Experienced" : ""} {monk ? "Monk" : ""}</button>
                            </div>
                        )}
                    </main>
                </>
            )}
        </div>
    )
}

export default GettingStarted;
