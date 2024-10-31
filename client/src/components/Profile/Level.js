import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../styles/level.css";

function Level({ userLevel }) {

    //loading state
    const [loading, setLoading] = useState(true);
    //error state
    const [error, setError] = useState(false);
    //literal level state
    const [level, setLevel] = useState(null);
    const [nextLevel, setNextLevel] = useState(null);
    //minutes
    const [minutes, setMinutes] = useState(null);

    const literalLevel = (lvl) => {
        switch (lvl) {
            case 1:
                setLevel("Beginner");
                setNextLevel("Experienced");
                break;
            case 2:
                setLevel("Experienced");
                setNextLevel("Monk");
                break;
            case 3:
                setLevel("Monk");
                break;
        }
    };

    const getMinutes = async () => {
        try {
            let { data } = await axios.get("https://meditrack-bw3b.onrender.com/level/get-career-minutes", { withCredentials: true });
            setMinutes(data)
        } catch (err) {
            console.log('get minutes error frontend', err);
            setError(true);
        }
    };

    

    useEffect(() => {
        if (userLevel) {
            literalLevel(userLevel)
        }
        getMinutes();
    }, []);

    useEffect(() => {
        if (level && (error || minutes !== null)) {
            setLoading(false);
        }
    }, [level, error, minutes]);

    return (
        <div className="level-div">
            {loading && (
                <div className='small-loader' data-testid="small-loader-monthly-progress">

                </div>
            )}

            {!loading && error && level && (
                <>
                    <h4>{level}</h4>
                    <p className="latest-session-error">An error has occured with fetching level progress.</p>
                    <h4>Next level: {nextLevel}</h4>
                </>
            )}

            {!loading && !error && level && (
                <>
                    <h4 id="level-text">{level}</h4>
                    {nextLevel && (
                        <>
                            <div className="level-progress-bar" style={{
                                '--progress-width': `${level == "Beginner" ? (minutes ? `${(minutes / 300) * 90}%` : 0) : (minutes - 300 !== 0 ? `${((minutes - 300) / 1200) * 90}%` : 0)}`
                                
                                }}>
                                <p className="latest-session-error" id="level-progress-minutes">{minutes < 300 ? minutes : minutes - 300} / {level == "Beginner" ? "300" : "1200"} mins</p>
                            </div>
                            <h4>Next level: {nextLevel}</h4>
                        </>
                    )}
                    {!nextLevel && (
                        <p className="latest-session-error">You are at the highest level, keep it up!</p>
                    )}

                </> 
            )}
        </div>
    )
}

export default Level
