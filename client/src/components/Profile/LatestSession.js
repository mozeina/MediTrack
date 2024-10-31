import React, { useState, useEffect } from 'react';
import axios from 'axios';


function LatestSession() {

    //latest session state: 
    const [latestSessionLoading, setLatestSessionLoading] = useState(true);
    const [latestSessionError, setLatestSessionError] = useState(false);
    const [latestSession, setLatestSession] = useState(null);
    //
    const getLatestSession = async () => {
        
        try {
            let latestSession = await axios.get("http://localhost:7777/session/get-latest-session", { withCredentials: true });
            if (latestSession.data.minutes == 0) {
                setLatestSession("You have no previous sessions.");
                setLatestSessionLoading(false);
            } else {

                let sessionMinutes = latestSession.data.minutes;
                let sessionDate = latestSession.data.date;
                
                let dateObj = new Date(Number(sessionDate));

                let day = dateObj.getDay(),
                    month = dateObj.getMonth() + 1,
                    date = dateObj.getDate(),
                    hour = dateObj.getHours(),
                    minute = dateObj.getMinutes();

                let weekday;

                switch (day) {
                    case 0:
                        weekday = "Sunday";
                        break;
                    case 1:
                        weekday = "Monday";
                        break;
                    case 2:
                        weekday = "Tuesday";
                        break;
                    case 3:
                        weekday = "Wednesday";
                        break;
                    case 4:
                        weekday = "Thursday";
                        break;
                    case 5:
                        weekday = "Friday";
                        break;
                    case 6:
                        weekday = "Saturday";
                        break;
                }

                setLatestSession({
                    minutes: Number(sessionMinutes).toFixed(1),
                    weekday,
                    month,
                    date,
                    hour,
                    minute
                });

                setLatestSessionLoading(false);
            }
        } catch (err) {
            setTimeout(() => {
                setLatestSessionError(true);
                setLatestSessionLoading(false);
            }, 5000)
        }
    }

    useEffect(() => {
        getLatestSession();
    }, []);

    return (
        <>
            {/* latest session loading */}
            {latestSessionLoading && (
                <div className='small-loader' data-testid="small-loader-latest-session">

                </div>
            )}

            {/* latest session error  */}
            {latestSessionError && (
                <p className="latest-session-error">An error has occured.</p>
            )}

            {/* latest session */}
            {latestSession && !latestSessionError && !isNaN(latestSession.minutes && latestSession.date) && (
                <div className="latest-session-success">
                    <p className="latest-session-minutes-number">{Number.isInteger(Number(latestSession.minutes)) ? Number(latestSession.minutes) : Number(latestSession.minutes).toFixed(1)}</p><br />
                    <p className="latest-session-minutes-text">minutes</p>
                    <p className="latest-session-date">{latestSession.weekday} {latestSession.date}/{latestSession.month} at {(latestSession.hour).toString().padStart(2, "0")}:{(latestSession.minute).toString().padStart(2, "0")}</p>
                </div>
            )}

            {/* latest session is 0 minutes  */}
            {latestSession && isNaN(latestSession.minutes) && (
                <p>{latestSession}</p>
            )}
        </>
    )
}

export default LatestSession
