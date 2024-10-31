import React, { useEffect, useState } from 'react'
import "../styles/aboutus.css";

function AboutUs() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true)
    }, 200);
  }, []);

  return (
    <main className={`about-us-main ${visible ? 'about-us-visible': ''}`} aria-labelledby="about-heading">
      <section className="about-header">
        <h1 id="about-heading">About MediTrack</h1>
        <p>Your journey to mindfulness, one session at a time</p>
      </section>

      <section className="about-content">
        <div className="about-our-mission">
          <h2>Our Mission</h2>
          <p>
            At MediTrack, we’re dedicated to supporting your meditation journey by making it easy to track your
            progress, set goals, and stay motivated. We believe that mindfulness should be accessible to everyone,
            and we're here to make that happen, one session at a time.
          </p>
        </div>
        <div className='about-our-vision'>
          <h2>Our Vision</h2>
          <p>
            We envision a world where everyone has access to the tools they need to achieve peace of mind.
            With MediTrack, we aim to be a supportive companion, helping you create a meditation practice that fits
            seamlessly into your life.
          </p>
        </div>
        <div className="about-contact-us">
          <h2>Contact Us</h2>
          <p>
            If you have any questions, feedback, or just want to say hello, please reach out!<br/>
            <a style={{color: "red"}} href="mailto:mozeina2004@gmail.com" aria-label="Email MediTrack Support">
              mozeina2004@gmail.com
            </a>
          </p>
        </div>
      </section>
    </main>
  )
}

export default AboutUs
