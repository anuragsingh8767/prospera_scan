import React,{useState}from 'react';
import '../assets/css/signup.css';
import logo from '../assets/layout/images/logo.png';
import 'primeicons/primeicons.css';
import loginDesign from '../assets/layout/images/loginDesign.gif'
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { ERROR_MESSAGES } from '../utils/constants';
import { validateUsername, validateEmail, validatePassword } from '../utils/validation';
import { Link, useNavigate } from 'react-router-dom';
import { useSignUp } from '../hooks/useSignUp';

const SignUpPage = () =>{
    const [username, setusername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setusernameError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const { handleSignUp, loading, apiError } = useSignUp();
    const navigate = useNavigate();

    const handleSignup =async ()=>{
        if (!validateUsername(username)) {
            setusernameError(ERROR_MESSAGES.INVALID_USERNAME);
            return;
        }
        if (!validateEmail(email)) {
            setEmailError(ERROR_MESSAGES.INVALID_EMAIL);
            return;
        }

        if (!validatePassword(password)) {
            setPasswordError(ERROR_MESSAGES.SHORT_PASSWORD);
            return;
        }

        const result = await handleSignUp({ username, email, password });
        if (result.success) {
            // Handle successful signup
            navigate('/');
        }
        else {
            // Handle error
            console.log('Signup failed');
        }
    };

    return (
        <div className="signup-body">
        <div className="signup-wrapper">
            <div className="signup-image">
            
                <div className="signup-image-content">
                <img src={loginDesign} alt="Loading" />
                    <h1>ProsperaScan</h1>
                    <h2 className="typing-effect">Securely Store, Seamlessly Access.</h2>
                </div>
                
                
            </div>
            <div className="signup-panel">
                <img src={logo} className="logo" alt="Company Logo" />
                <h1>ProsperaSoft</h1>

                <div className="signup-form">
                    <h2>SignUp</h2>
                    <InputText
                        value={username}
                        invalid={usernameError}
                        placeholder='User Name'
                        onChange={(e) => { setusername(e.target.value); setusernameError('') }}
                        className={usernameError ? 'p-inputtextError' : ''}   
                    />
                    {usernameError && <p className="error-message">{usernameError}</p>}
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
                        placeholder='Password'
                        onChange={(e) => { setPassword(e.target.value); setPasswordError('') }}
                        value={password}
                        type={passwordVisible ? 'text' : 'password'}
                        className={passwordError ? 'p-inputtextError' : ''}
                    />
                     <i className={`pi ${passwordVisible ? 'pi-eye-slash' : 'pi-eye'} password-icon`}
                     onClick={() => setPasswordVisible(!passwordVisible)}
                    ></i>
                    </div>
                    {passwordError && <p className="error-message">{passwordError}</p>}
                    <Button
                            label="Sign Up"
                            type="button"
                            onClick={handleSignup}
                            disabled={loading}
                            className="p-button-text-right-spinner"
                        >
                             {loading && <i className="pi pi-spin pi-spinner p-ml-2" />}
                        </Button>              
                </div>
                {apiError && <p className="error-message">{apiError}</p>}
                <p>Already have an account? <Link to="/">Login</Link></p>
            </div>
        </div>
    </div>
    );
};

export default SignUpPage;