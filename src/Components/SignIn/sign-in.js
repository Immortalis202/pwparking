import React, { useState, useEffect } from "react";
import './sign-in.css';

const SignIn = () => {
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confermaPassword, setConfermaPassword] = useState('');
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [user, setUser] = useState("");

    const login = (event) => {
        const form = event.target;
        const nome = form.event.value;
        const cognome = form.event.value;
        const email = form.email.value;
        const password = form.password.value;
        const confermaPassword = form.confermaPassword.value;
    }

    useEffect(() => {
        validateEmail();
    }, [email]);

    useEffect(() => {
        validatePassword();
    }, [password]);

    const validateEmail = () => {   
        const pattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        setEmailValid(pattern.test(email));
    }    

    const validatePassword = () => {       
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        setPasswordValid(pattern.test(password));
    }    
    const resetInput = () => {
        setEmailValid(false);
        setPasswordValid(false);
    }

    return (
        <div>
            {user ? (
                <div></div>
            ) : (
                <div className="form-container">
                    <form method="post" onSubmit={login}>
                        <h1>Sign Up</h1>
                        <div className="input">
                            <label>Inserisci l'email</label>
                            <input type="text" name="nome" placeholder="nome" onChange={(e) => setNome(e.target.value)} />
                        </div>
                        <div className="input">
                            <label>Inserisci l'email</label>
                            <input type="text" name="cognome" placeholder="cognome" onChange={(e) => setCognome(e.target.value)} />
                        </div>
                        <div className="input">
                            <label>Inserisci l'email</label>
                            <input type="email" name="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="input">
                            <label>Inserisci la password</label>
                            <input type="password" name="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="input">
                            <label>Conferma password</label>
                            <input type="password" name="conferma-password" placeholder="conferma password" onChange={(e) => setConfermaPassword(e.target.value)} />
                        </div>
                        <div className="button">
                            <input type="submit" value="Invia" className="submit" disabled={!(emailValid && passwordValid)} />
                            <input type="reset" value="Cancella" className="reset" onClick={resetInput} />
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default SignIn;
