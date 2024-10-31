import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/session.css";
import { ArrowClockwise, XLg } from 'react-bootstrap-icons';
import axios from 'axios';
//error div 
import Error from './Error';
//error context
import ErrorDivContext from '../context/ErrorDivContext';
import LevelUpContext from "../context/LevelUpContext";
//misc functions
import { getDay, getMonth } from './Profile/misc/miscFuntions';

function Session() {

  //misc
  const [visible, setVisible] = useState(false);
  //session 
  const [sessionStarted, setSessionStarted] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [pausePlay, setPausePlay] = useState("play");
  //start of session
  const [startTime, setStartTime] = useState(null);
  //cancel button
  const [cancelConfirmationVisible, setCancelConfirmationVisible] = useState(false);
  //end button 
  const [endSessionVisible, setEndSessionVisible] = useState(false);
  //stopwatch functions
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef(null);
  const [formattedTime, setFormattedTime] = useState(0);
  const lastTimeRef = useRef(Date.now());
  //navigate
  const navigate = useNavigate();
  //error context
  const { error, setError } = useContext(ErrorDivContext);
  //level up setter
  const { setLevelUp } = useContext(LevelUpContext);


  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 200)
  }, []);

  const checkAuth = async () => {
    try {
      await axios.get("http://localhost:7777/checkAuth", { withCredentials: true });
      return true;
    } catch (err) {
      return false;
    }
  }

  const handleSessionStart = async () => {
    //we have to check if user is signed in on session start, if not we should redirect to login
    let authResult = await checkAuth();
    if (!authResult) {
      navigate("/login");
      return;
    }
    setStartTime(Date.now());
    setShrink(true)
    setTimeout(() => {
      setSessionStarted(true);
      setIsRunning(true);
      lastTimeRef.current = Date.now();
    }, 500)
  }

  const handlePausePlay = () => {
    if (pausePlay === "play") {
      setPausePlay("pause");
      setIsRunning(false);
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else {
      if (elapsedTime === 0) {
        setStartTime(Date.now());
      }
      setPausePlay("play")
      setIsRunning(true);
      lastTimeRef.current = Date.now();

    }
  };

  const handleReset = () => {
    setElapsedTime(0);
    setStartTime(null);
  }

  const handleEndSession = async () => {
    if (cancelConfirmationVisible) return;
    //if session seconds are 0 we will just navigate and return
    if (elapsedTime == 0) {
      navigate("/profile");
      return;
    }
    //so on end session we have to update the lastest session, weekly progress, and monthly progress in the backend 
    try {
      //end session
      let level = await axios.post("http://localhost:7777/session/end-session", {
        newMinutes: (elapsedTime / 60).toFixed(2),
        newDate: startTime,
        day: getDay(),
        month: getMonth(),
        careerMinutes: Math.floor(elapsedTime / 60)
      }, { withCredentials: true });

      if ("levelup" in level.data) {
        let newLevel = level.data["levelup"];
        setLevelUp(newLevel);
      }
      navigate("/profile");

    } catch (err) {
      setError(true);
    }
  };

  const handleCancel = () => {
    setCancelConfirmationVisible(!cancelConfirmationVisible);
  };

  const handleConfirmCancel = () => {
    setElapsedTime(0);
    setSessionStarted(false);
    setPausePlay("play");
    setShrink(false);
    setCancelConfirmationVisible(false);
    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };


  useEffect(() => {
    if (pausePlay === "pause") {
      setTimeout(() => {
        setEndSessionVisible(true)
      }, 200);
    } else {
      setEndSessionVisible(false);
    }
  }, [pausePlay]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const delta = (now - lastTimeRef.current) / 1000;
        setElapsedTime(prev => prev + delta)
        lastTimeRef.current = now;
      }, 1000)
    }

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [isRunning])

  useEffect(() => {

    let totalSeconds = Math.floor(elapsedTime);

    let minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    let hours = Math.floor(totalSeconds / (60 * 60));
    let seconds = totalSeconds - (minutes * 60) - (hours * 3600);

    let formattedMinutes = String(minutes).padStart(2, "0");
    let formattedHours = String(hours).padStart(2, "0");
    let formattedSeconds = String(seconds).padStart(2, "0");

    setFormattedTime(`${formattedHours !== "00" ? formattedHours + ":" : ""}${formattedMinutes}:${formattedSeconds}`);
  }, [elapsedTime]);



  return (
    <div className={`session-background ${visible ? "visible" : ""}`}>
      {error === true && <Error />}
      <div className={`timer ${sessionStarted ? "glow" : ""}`}>
        {/* cancel session div  */}
        <div className={`cancel-confirmation ${cancelConfirmationVisible ? "visibleIndexed" : ""}`}>
          <div className="cancel-confirmation-form">
            <h4>Are you sure you want to cancel this session?</h4>
            <p id="cancel-confirmation-form-confirm" data-testid="confirm-session-cancellation" onClick={handleConfirmCancel}>Confirm</p>
            <p id="cancel-confirmation-form-cancel" onClick={() => setCancelConfirmationVisible(false)}>Cancel</p>
          </div>
        </div>

        <h1>{formattedTime}</h1>
        <div className="timer-controls">
          {!sessionStarted && (
            <button id='start-session-button' data-testid="start-session-button" className={shrink ? "shrinkInwards" : ""} onClick={handleSessionStart}>Start Session</button>
          )}
          {sessionStarted && (
            <>
              {pausePlay === "pause" && (
                <p id="cancel-session" data-testid="cancel-session" onClick={handleCancel}><XLg id="x-lg" /></p>
              )}

              <p id="pause-play" className={pausePlay === "play" ? "play" : "pause"} data-testid="pause-play" onClick={handlePausePlay}></p>

              {pausePlay === 'pause' && (
                <p id="reset-timer" data-testid='reset-button' onClick={handleReset}><ArrowClockwise id="arrow-clockwise" /></p>
              )}

              <button id="end-session" className={endSessionVisible ? "end-session-visible" : ""} data-testid="end-session-button" onClick={handleEndSession}>End Session</button>

            </>
          )}
        </div>
      </div>
    </div >
  )
}

export default Session
