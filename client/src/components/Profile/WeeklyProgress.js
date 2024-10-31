import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../styles/weeklyProgress.css";

function WeeklyProgress() {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [weeklyProgress, setWeeklyProgress] = useState('');
    const [maxWeeklyProgress, setMaxWeeklyProgress] = useState("");
    //day logic
    const day = new Date().getDay(); //here is should ideally be new Date().getDay();
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].slice(0, day ? day : 7);
    //screen width logic :P
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const getWeeklyProgress = async () => {
        try {
            let progress = await axios.get("https://meditrack-bw3b.onrender.com/session/get-weekly-progress", { withCredentials: true });
            //here the indexes 0-6 in the array represent the days of the week starting from monday, and the values are the minutes for each day.
            setWeeklyProgress(Object.values(progress.data).slice(0, day ? day : 7));
            setError(false);
        } catch (err) {
            setError(true)
            setLoading(false);
        }
    };

    useEffect(() => {
        getWeeklyProgress();
    }, [])

    useEffect(() => {
        if (weeklyProgress) {
            setMaxWeeklyProgress(Math.max(...weeklyProgress));
            setLoading(false);
        }
    }, [weeklyProgress]);

    //screen width setter
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, []);

    return (
        <>
            {loading && (
                <div className='small-loader' data-testid="small-loader-weekly-progress">

                </div>
            )}
            {!loading && error && (
                <p className="latest-session-error">An error has occured with fetching weekly progress.</p>
            )}
            {!loading && weeklyProgress && days && maxWeeklyProgress !== '' && (
                <div className="weekly-progress-graph">
                    {days.map((day, index) => (
                        <div className={day.toLowerCase()} key={index + 1}>
                            <div className="progress-bar" style={{ height: `${maxWeeklyProgress > 0 ? `${(weeklyProgress[index] / maxWeeklyProgress) * (screenWidth > 899 ? 60 : 50)}%` : "0%"}` }}></div>
                            <h5>{weeklyProgress[index] ? (
                                <>
                                    {weeklyProgress[index]}
                                    {screenWidth < 900 ? <br /> : " "}
                                    mins
                                </>
                            ) : (
                                <>
                                    No
                                    {screenWidth < 900 ? <br /> : " "}
                                    activity
                                </>
                            )}</h5>
                            <h4>{screenWidth > 900 ? day : day.slice(0, 3)}</h4>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

//style={{ height: `${maxWeeklyProgress > 0 ? `${(weeklyProgress[index] / maxWeeklyProgress) * 70}%` : "0%"}` }} here is the style for the progress bar

export default WeeklyProgress;
