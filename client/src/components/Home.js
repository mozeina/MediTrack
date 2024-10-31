import React, { useEffect, useState } from 'react';
import "../styles/home.css";
//images
import beginnerImage from "../images/beginner.png";
import experiencedImage from "../images/intermediate.png";
import monkImage from "../images/monk.png";
import up from "../images/progress-bar-icon.png";
//
import timer from "../images/timer.png";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Home() {

  const navigate = useNavigate();

  useEffect(() => {
    checkLoggedIn();
  }, []);

  const checkLoggedIn = async () => {
    try {
      await axios.get("https://meditrack-bw3b.onrender.com/checkAuth", { withCredentials: true });
      navigate("/profile");
    } catch (err) {
      return;
    }
  };

  const [visibleHeader, setVisibleHeader] = useState(false);
  const [visibleGettingStarted, setVisibleGettingStarted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisibleHeader(true);
    }, 200)
  }, []);

  useEffect(() => {
    if (visibleHeader) {
      setTimeout(() => {
        setVisibleGettingStarted(true);
      }, 1500);
    }
  }, [visibleHeader])

  return (
    <div className='home'>
      <header>
        <h1 className={`site-heading ${visibleHeader ? "visible" : ""}`} >Track your meditation journey to mindfulness.</h1>
      </header>
      <main>
        <section className={`getting-started ${visibleGettingStarted ? "visible" : ""}`}>
          <h2 id="getting-started-header">Getting Started</h2>
          <h3 id="choose-your-level">Choose your level of experience:</h3>
          <div className='starting-levels' aria-label='Levels to choose from upon creating an account.'>
            <div className='beginner'>
              <img src={beginnerImage} alt="Icon representing a beginner level" />
              <h3>Beginner</h3>
              <p>Little to no mediation experience.</p>
            </div>
            <div className='experienced'>
              <img src={experiencedImage} alt="Icon representing an experienced level" />
              <h3>Experienced</h3>
              <p>Practices meditation frequently.</p>
            </div>
            <div className='monk'>
              <img src={monkImage} alt="Icon representing an experienced level" />
              <h3>Monk</h3>
              <p>An expert at <br /> meditation.</p>
            </div>
          </div>
        </section>
        <section className={`track-and-record ${visibleGettingStarted ? "visible" : ""}`} aria-label='Track and time meditation sessions section.'>
          <h2>Track and record your meditation sessions!</h2>
          <img id="home-stopwatch" src={timer} alt="image of a stopwatch." />
          <h3>MediTrack will allow you to time your meditation sessions and save them to your profile.</h3>
        </section>
        <section className={`home-progress ${visibleGettingStarted ? "visible" : ""}`} aria-label="View weekly and monthly progress section">
          <h2>View your weekly and monthly progress.</h2>
          <img src={up} id='progress-bars-img' alt="Image of progress bars"/>
          <h3>You can view your progress and total meditation time on your profile page.</h3>
        </section>
        <section className={`move-up-levels ${visibleGettingStarted ? "visible" : ""}`} aria-label="Move up the levels in MediTrack section">
          <h2>Move up the levels!</h2>
          <h3>Your meditation level will increase as you register your meditation sessions.</h3>
        </section>
        <section className={`register-or-login ${visibleGettingStarted && "visible"}`}>
          <h2><Link className="red" to="/signup">Sign up</Link> now to start your meditation journey!</h2>
          <h3>Already have an account? <Link  className="red" to="/login">Log in</Link>.</h3>
        </section>
      </main>
    </div>
  )
}

export default Home
