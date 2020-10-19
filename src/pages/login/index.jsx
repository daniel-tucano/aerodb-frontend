import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import AuthContext from '../../contexts/auth'

import './Login.css'

import AeroDBLogoName from '../../assets/icons/AeroDB_logo_name.svg'
import backIcon from '../../assets/icons/chevron_left-24px.svg'
import lockIcon from '../../assets/icons/lock-24px.svg'
import emailIcon from '../../assets/icons/mail_outline-24px.svg'
import googleIcon from '../../assets/icons/Google__G__Logo.svg'
import facebookFIcon from '../../assets/icons/Facebook-f_Logo-Blue-Logo.wine.svg'
import facebookName from '../../assets/icons/Facebook-Logo.wine.svg'

function Login() {
    const [email, setEmail ] = useState('')
    const [password, setPassword] = useState('')
    const { signIn } = useContext(AuthContext)
    const history = useHistory()

    function handleEmailChange (e) {
        setEmail(e.target.value)
    }   

    function handlePasswordChange (e) {
        setPassword(e.target.value)
    }

    const handleLoginClick = () => {
        signIn('custom', {email, password})
    }

    const handleLoginGoogle = () => {
        signIn('google')
    }

    const handleLoginFacebook = () => {
        signIn('facebook')
    }
    
    return (
        <div className='login-wrapper'>

            <div className="back-button">
                <div className='link-button' onClick={() => history.goBack()}>
                    <img src={backIcon} alt="back" />
                    <span>BACK</span>
                </div>
            </div>

            <div className="container">
                <div className="logo-name">
                    <img src={AeroDBLogoName} alt="" />
                </div>
                <div className="login-card">
                    <h1 className="title">LOGIN</h1>
                    <div className="input-block">
                        <div className="input-box">
                            <img src={emailIcon} alt="email" />
                            <input type='text' placeholder='email' className="email" onChange={handleEmailChange} />
                        </div>
                        <div className="input-box">
                            <img src={lockIcon} alt="password" />
                            <input type='text' placeholder='password' className="password" onChange={handlePasswordChange} />
                        </div>
                    </div>
                    <div className="login-button">
                        <button onClick={handleLoginClick}>LOGIN</button>
                    </div>
                    <span id="or-login-with">or login with</span>
                    <div className="diferent-providers-block">
                        <button className="facebook-button" onClick={handleLoginFacebook}>
                            <img src={facebookFIcon} alt="" />
                            <img src={facebookName} className='facebook-button-name-logo' alt="" />
                        </button>
                        <button className="google-button" onClick={handleLoginGoogle}>
                            <img src={googleIcon} alt="" />
                            <span>Google</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Login
