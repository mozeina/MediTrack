import React, { useEffect, useState } from 'react';
import axios from "axios";
import "../../styles/monthlyProgress.css";


function MonthlyProgress() {


    const [monthlyProgressObj, setMonthlyProgressObj] = useState("");
    const [existingMonths, setExistingMonths] = useState('');
    const [maxExistingMonths, setMaxExistingMonths] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //screen width for progress bars :P
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const getMonthlyProgress = async () => {
        try {
            let progress = await axios.get("https://meditrack-bw3b.onrender.com/session/get-monthly-progress", { withCredentials: true });
            setMonthlyProgressObj(progress.data);
            setError(false);
        } catch (err) {
            setError(true);
            setLoading(false);
        }
    };


    useEffect(() => {
        getMonthlyProgress();
    }, []);

    //debug -> 
    useEffect(() => {
        if (monthlyProgressObj) {
            let months = [];
            Object.keys(monthlyProgressObj).map(month => {
                if (monthlyProgressObj[`${month}`] || monthlyProgressObj[`${month}`] == 0) {
                    months.push(`${month}`);
                }
            });
            setExistingMonths(screenWidth > 1600 ? months : months.slice(-5))
        }
    }, [monthlyProgressObj, screenWidth]);

    useEffect(() => {
        if (existingMonths) {
            setMaxExistingMonths(Math.max(...Object.values(monthlyProgressObj)))
            setLoading(false);
        }
    }, [existingMonths]);

    //screen width setter   
    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        }
    })

    return (
        <>
            {loading && (
                <div className='small-loader' data-testid="small-loader-monthly-progress">

                </div>
            )}

            {!loading && error && (
                <p className="latest-session-error">An error has occured with fetching monthly progress.</p>
            )}


            {!loading && monthlyProgressObj && existingMonths && (maxExistingMonths == 0 || maxExistingMonths) && (
                <div className='monthly-progress-graph'>
                    {existingMonths.map((month, index) => (
                        <div key={`month ${index + 1}`} className={month}>
                            <div className="month-progress-bar" style={{
                                height: `${maxExistingMonths > 0 ? `${(monthlyProgressObj[month] / maxExistingMonths) * (screenWidth > 899 ? 60 : 45)}% ` : "0%"}`
                            }}></div>
                            <h5>{monthlyProgressObj[month] ? (
                                <>
                                    {Number.isInteger(monthlyProgressObj[month]) ? Number(monthlyProgressObj[month]) : Number(monthlyProgressObj[month]).toFixed(2)}
                                    {screenWidth < 900 ? <br /> : " "}
                                    hrs
                                </>
                            ) : (
                                <>
                                    No
                                    <br />
                                    activity
                                </>
                            )}</h5>
                            <h4>{`${month[0].toUpperCase() + month.slice(1)}`}</h4>
                        </div>
                    ))}
                </div>
            )}

        </>
    )
}

export default MonthlyProgress
