import React, { useState, useEffect, useContext } from 'react'
import "../styles/signup.css";
import { useNavigate, Link } from "react-router-dom";
import { Person, EnvelopeAt, Lock } from "react-bootstrap-icons";
import axios from "axios";
import { PersonCheckFill, ExclamationCircleFill } from "react-bootstrap-icons";
import HeaderContext from '../context/HeaderContext';

function Login() {
    const navigate = useNavigate();
    const { setHeaderUpdate } = useContext(HeaderContext);

    const [formValues, setFormValues] = useState({
        email: "",
        password: "",
    })

    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");


    const handleFormChange = (e) => {
        setFormValues(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
    }


    const readyToLogin = (e) => {
        e.preventDefault();
        setFormError("");
        setFormSuccess("");

        setTimeout(() => {
            handleLogin();
        }, 200);
    }
    const handleLogin = async () => {

        const { email, password } = formValues;

        try {
            await axios.post("https://meditrack-bw3b.onrender.com/users/login", {
                email, password
            }, { withCredentials: true });
            setFormSuccess("Login successful"); 
            setHeaderUpdate(prev => !prev);
            setTimeout(() => {
                 navigate("/profile");
            }, 2000);

        } catch (err) {
            if (err.response?.data?.error) {
                setFormError(err.response.data.error);
            } else if (!err.response) {
                setFormError("Internal server error.");
            } else {
                setFormError("Internal server error.");
            }
        }

    }


    return (
        <div className='sign-up'>
            <form onSubmit={(e) => readyToLogin(e)}>
                <h3>Login</h3>

                {formError !== "" && !Array.isArray(formError) && (
                    <div className='sign-up-error'>
                        <p><ExclamationCircleFill className='exclamation-circle-fill' />{formError}</p>
                    </div>
                )}

                {formError !== "" && Array.isArray(formError) && (
                    <div className='sign-up-error'>
                        {formError.map(error => (
                            <p> <ExclamationCircleFill className='exclamation-circle-fill' />{error}</p>
                        ))}
                    </div>
                )}

                {formSuccess !== "" && (
                    <div className="sign-up-success">
                        <p>{formSuccess}<PersonCheckFill id="person-check-fill" /></p>
                    </div>
                )}



                <div className='input-box'>
                    <input id="email" name="email" type='text' placeholder='Email' onChange={(e) => handleFormChange(e)} required /><EnvelopeAt className="bootstrap-icon" />
                </div>
                <div className='input-box'>
                    <input id="password" name="password" type='password' placeholder='Password' onChange={(e) => handleFormChange(e)} required /><Lock className="bootstrap-icon" />
                </div>

                <button className='btn' type="submit" data-testid="log-in-button">Log In</button>

                <div className="already">
                    <p>Dont have an account? Sign up <Link to="/signup">here</Link>.</p>
                </div>
            </form>


        </div>
    )
}

export default Login
