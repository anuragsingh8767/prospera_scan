import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearAuthErrors } from '../Features/auth/authSlice';
import { ERROR_MESSAGES } from '../utils/constants';
import { validateEmail, validatePassword } from '../utils/validation';
import '../assets/css/login.css';
import logo from '../assets/layout/images/logo.png';
import 'primeicons/primeicons.css';
import loginDesign from '../assets/layout/images/loginDesign.gif'
import {Link } from 'react-router-dom';

const Login = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const { status, error } = useSelector((state) => state.auth);

    const handleLogin = () => {
        if (!validateEmail(email)) {
            setEmailError(ERROR_MESSAGES.INVALID_EMAIL);
            return;
        }

        if (!validatePassword(password)) {
            setPasswordError(ERROR_MESSAGES.SHORT_PASSWORD);
            return;
        }

        dispatch(loginUser({ email, password }));
    };
    useEffect(() => {
        // Clear errors on component mount
        dispatch(clearAuthErrors());
    }, [dispatch]);
    return (
        <div className="login-body">
            <div className="login-wrapper">
                <div className="login-image">
                
                    <div className="login-image-content">
                    <img src={loginDesign} alt="Loading" />
                        <h1>ProsperaScan</h1>
                        <h2 className="typing-effect">Securely Store, Seamlessly Access.</h2>
                    </div>
                    
                    
                </div>
                <div className="login-panel">
                    <img src={logo} className="logo" alt="Company Logo" />
                    <h1>ProsperaSoft</h1>

                    <div className="login-form">
                        <h2>Login</h2>
                        <InputText
                            invalid={emailError}
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                            placeholder="Email"
                            className={emailError ? 'p-inputtextError' : ''}
                        />
                        {emailError && <p className="error-message">{emailError}</p>}
                        <div className="input-container">
                            <InputText
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setPasswordError('') }}
                                placeholder="Password"
                                type={passwordVisible ? 'text' : 'password'}
                                className={passwordError ? 'p-inputtextError' : ''}
                            />
                            <i
                                className={`pi ${passwordVisible ? 'pi-eye-slash' : 'pi-eye'} password-icon`}
                                onClick={() => setPasswordVisible(!passwordVisible)}
                            ></i>
                        </div>
                        {passwordError && <p className="error-message">{passwordError}</p>}
                        <Button
                            label="Login"
                            type="button"
                            onClick={handleLogin}
                            disabled={status === 'loading'}
                            className="p-button-text-right-spinner"
                        >
                            {status === 'loading' && <i className="pi pi-spin pi-spinner p-ml-2" />}
                        </Button>

                    </div>
                    <p>Don't have an account? <Link to="/signup">Sign Up Now</Link></p>
                    {error && <p className="error-message">{error}</p>}
                </div>
            </div>
        </div>
    );
};
export default Login;
