import React , {useState} from "react";
import './sign-in.css';

const SignIn = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);

    const validateEmail = () => {   
        const pattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        setEmailValid(pattern.test(email));
    }    
    const validatePassword = () => {       
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        setPasswordValid(pattern.test(password));
    }    
    return (
        <div className="form-container">
            <form method="post">
                <h1>Login</h1>
                <div className="input">
                    <label>Inserisci l'email</label>
                    <input type="email" placeholder="email" onChange={(e) => {setEmail(e.target.value); validateEmail();}} />
                </div>
                <div className="input">
                    <label>Inserisci la password</label>
                    <input type="password" placeholder="password" onChange={(e) => {setPassword(e.target.value); validatePassword();}} />
                </div>
                <div className="button">
                    <input type="submit" value="Invia" className="submit" disabled={!(emailValid && passwordValid)} />
                    <input type="reset" value="Cancella" className="reset" />
                </div>
            </form>
        </div>
    );
}

export default SignIn;

