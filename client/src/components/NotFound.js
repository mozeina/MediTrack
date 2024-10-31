import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/general.css";

function NotFound() {
    const navigate = useNavigate();

        useEffect(() => {
            navigate("/");
        }, [])
    return (
        <div className="not-found">

        </div>
    )
}

export default NotFound
