import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
//header context 
import HeaderContext from '../context/HeaderContext';
//level up context 
import LevelUpContext from "../context/LevelUpContext";
//username slice 
import { useDispatch, useSelector } from 'react-redux';
import { setUsername } from "../slices/usernameSlice";
//styles
import "../styles/profile.css";

//child components
import WeeklyProgress from './Profile/WeeklyProgress';
import LatestSession from './Profile/LatestSession';
import MonthlyProgress from './Profile/MonthlyProgress';
import Level from './Profile/Level';

function Profile() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  //contexts
  const { setHeaderUpdate } = useContext(HeaderContext);
  const { levelUp, setLevelUp } = useContext(LevelUpContext);

  const [loading, setLoading] = useState(true);

  //component visibility 
  const [visibleComponent, setVisibleComponent] = useState(false);

  const [checkLevelTrigger, setCheckLevelTrigger] = useState(false);

  const username = useSelector(state => state.username.username);
  //user level
  const [userLevel, setUserLevel] = useState(null);
  //congratulations state;
  const [congrats, setCongrats] = useState(false);
  const [congratsVisible, setCongratsVisible] = useState(false);

  const checkAuth = async () => {
    try {
      await axios.get("http://localhost:7777/checkAuth", { withCredentials: true });
      setCheckLevelTrigger(true);
    } catch (err) {
      navigate("/login");
      setHeaderUpdate(prev => !prev);
      dispatch(setUsername(""));
    }
  };

  const levelExistsCheck = async () => {
    try {
      let usersLevel = await axios.get("http://localhost:7777/level/check-level", { withCredentials: true });
      if (!usersLevel.data) {
        navigate("/getting-started");
      } else {
        setUserLevel(usersLevel.data);
        return;
      }
    } catch (err) {
      navigate("/login");
    }
  };


  useEffect(() => {
    window.scrollTo(0, 0);
    checkAuth();
    setTimeout(() => {
      setVisibleComponent(true);
    }, 200);
  }, []);

  useEffect(() => {
    if (levelUp === "experienced" || levelUp === "monk") {
      setCongrats(true)
      setTimeout(() => {
        setCongratsVisible(true);
      }, 200);
    }
  }, [levelUp]);

  const hideCongrats = () => {
    setCongratsVisible(false);
    setTimeout(() => {
      setCongrats(false);
      setLevelUp(false);
    }, 300);
  }

  useEffect(() => {
    if (checkLevelTrigger) {
      levelExistsCheck();
    }
  }, [checkLevelTrigger]);

  useEffect(() => {
    if (username) {
      setLoading(false);
    } else {
      dispatch(setUsername("User"));
      setLoading(false);
    }
  }, [])

  return (
    <div className={`profile-component ${visibleComponent ? "visible" : ""}`}>
      {loading && (
        <div className='loader' data-testid="loader"></div>
      )}

      {!loading && username && (
        <>
          {congrats && (
            <div className={`congrats ${congratsVisible ? "visible" : ""}`}>
              <div className="congrats-contents">
                <h3>Level Up!</h3>
                {levelUp === "experienced" && (
                  <>
                    <p>Congratulations on reaching Experienced level, Keep it up!</p>
                    <p>To reach monk level, you will need to complete another 1200 minutes (or 20 hours) of meditation, we are sure you are capable!</p>
                  </>
                )}
                {levelUp === "monk" && (
                  <>
                    <p>Congratulations on reaching Monk level! Give yourself a pat on the back!</p>
                    <p>Stay consistent!</p>
                  </>
                )}
                <button onClick={hideCongrats} className="error-button" id="close-button">Close</button>
              </div>
            </div>
          )}

          <div className='grid-container'>
            <div className="username-dashboard">
              <h3>{username}'s Dashboard</h3>
            </div>

            {/* start a session div  */}
            <div className="start-a-session" data-testid="start-a-session" onClick={() => navigate("/session")}>
              <h3>Start a Session</h3>
            </div>

            {/* weekly progress div  */}
            <div className="weekly-progress relative">
              <h3>Weekly Progress:</h3>
              <WeeklyProgress />
            </div>

            {/* latest session div */}
            <div className="latest-session relative">
              <h3>Latest Session:</h3>
              <LatestSession />
            </div>

            {/* monthy progress div  */}
            <div className="monthly-progress relative">
              <h3>Monthly Progress:</h3>
              <MonthlyProgress />
            </div>

            {/* upcoming challenge  */}
            <div className="upcoming-challenge">
              <h3>Current Level:</h3>
              {userLevel && (
                <Level userLevel={userLevel} />
              )}
            </div>
          </div>
        </>
      )}
    </div>

  )
}

export default Profile;
