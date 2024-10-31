import React from 'react'
import "../styles/general.css";
import { useContext } from 'react';
//error div context
import ErrorDivContext from '../context/ErrorDivContext';

function Error() {

    const {setError} = useContext(ErrorDivContext);

    const handleErrorClose = () => {
        setError(false);
    }

    return (
        <div className="error-div">
            <div className='error-form'>
                <p id="error-div-paragraph">An error has occured.</p>
                <p className="error-button" onClick={handleErrorClose}>Close</p>
            </div>
        </div>
    )
}

export default Error
