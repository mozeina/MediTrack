import React, { useState, useContext, useEffect } from 'react'
import "../styles/signup.css";
import { useNavigate, Link } from "react-router-dom";
import { Person, EnvelopeAt, Lock } from "react-bootstrap-icons";
import axios from "axios";
import { PersonCheckFill, ExclamationCircleFill } from "react-bootstrap-icons";
import HeaderContext from '../context/HeaderContext';

function Signup() {

    const navigate = useNavigate();
    const { setHeaderUpdate } = useContext(HeaderContext);
    const [formValues, setFormValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
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


    const readyToSignUp = (e) => {
        e.preventDefault();
        setFormError("");
        setFormSuccess("");

        setTimeout(() => {
            handleSignUp();
        }, 200);
    }
    const handleSignUp = async () => {

        const { username, email, password, confirmPassword } = formValues;

        if (password !== confirmPassword) {
            setFormError("Provided passwords do not match.");
            return;
        }

        try {
            await axios.post("https://meditrack-bw3b.onrender.com/users/register", {
                username, email, password
            }, { withCredentials: true })
            setFormSuccess("Account created successfully.");
            setTimeout(() => {
                navigate("/getting-started");
                setHeaderUpdate(prev => !prev);
            }, 2000);

        } catch (err) {
            if (err.response?.data?.errors?.length > 0) {
                let errorMessageArray = err.response.data.errors.map(error => {
                    return error.msg;
                })
                setFormError(errorMessageArray);
            } else if (err.response?.data?.error) {
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
            <form onSubmit={(e) => readyToSignUp(e)}>
                <h3>Create a new account</h3>

                {formError !== "" && !Array.isArray(formError) && (
                    <div className='sign-up-error'>
                        <p><ExclamationCircleFill className='exclamation-circle-fill' />{formError}</p>
                    </div>
                )}

                {formError !== "" && Array.isArray(formError) && (
                    <div className='sign-up-error'>
                        {formError.map((error, index) => (
                            <p key={`error-${index}`}> <ExclamationCircleFill className='exclamation-circle-fill' />{error}</p>
                        ))}
                    </div>
                )}

                {formSuccess !== "" && (
                    <div className="sign-up-success">
                        <p>{formSuccess}<PersonCheckFill id="person-check-fill" /></p>
                    </div>
                )}


                <div className='input-box'>
                    <input id="username" name="username" type='text' placeholder='Username' onChange={(e) => handleFormChange(e)} required /><Person className='bootstrap-icon' />
                </div>
                <div className='input-box'>
                    <input id="email" name="email" type='text' placeholder='Email' onChange={(e) => handleFormChange(e)} required /><EnvelopeAt className="bootstrap-icon" />
                </div>
                <div className='input-box'>
                    <input id="password" name="password" type='password' placeholder='Password' onChange={(e) => handleFormChange(e)} required /><Lock className="bootstrap-icon" />
                </div>
                <div className='input-box'>
                    <input id="confirmPassword" name="confirmPassword" type='password' placeholder='Confirm password' onChange={(e) => handleFormChange(e)} required /><Lock className="bootstrap-icon" />
                </div>
                <button className='btn' type="submit" data-testid="sign-up-button">Sign Up</button>

                <div className="already">
                    <p>Already have an account? Log in <Link to="/login">here</Link>.</p>
                </div>
            </form>


        </div>
    )
}

export default Signup
