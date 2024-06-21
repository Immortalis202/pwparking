import React, { useState, useEffect } from "react";
import './sign-in.css';

const SignIn = () => {
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confermaPassword, setConfermaPassword] = useState('');
    const [nomeValid, setNomeValid] = useState(false);
    const [cognomeValid, setCognomeValid] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [confermaPasswordValid, setConfermaPasswordValid] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState("");

    const login = (event) => {
        const form = event.target;
        const cognome = form.event.value;
        const nome = form.event.value;
        const email = form.email.value;
        const password = form.password.value;
        const confermaPassword = form.confermaPassword.value;

        
    }

    useEffect(() => {
        validateNome();
    }, [nome]);

    useEffect(() => {
        validateCognome();
    }, [cognome]);

    useEffect(() => {
        validateEmail();
    }, [email]);

    useEffect(() => {
        validatePassword();
    }, [password]);

    useEffect(() => {
        validateConfermaPassword();
    }, [confermaPassword]);

    const validateNome = () => {
        const pattern = /^[a-zA-Z]+$/;
        setNomeValid(pattern.test(nome));
    }

    const validateCognome = () => {
        const pattern = /^[a-zA-Z]+$/;
        setCognomeValid(pattern.test(cognome));
    }
    
    const validateEmail = () => {   
        const pattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        setEmailValid(pattern.test(email));
    }    

    const validatePassword = () => {       
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        setPasswordValid(pattern.test(password));
    }    

    const validateConfermaPassword = () => {
        setConfermaPasswordValid(password === confermaPassword);
    }

    const resetInput = () => {
        setNomeValid(false);
        setCognomeValid(false);
        setEmailValid(false);
        setPasswordValid(false);
        setConfermaPassword(false);
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
                            <label>Inserisci il nome</label>
                            <input type="text" name="nome" placeholder="nome" onChange={(e) => setNome(e.target.value)} required/>
                        </div>
                        <div className="input">
                            <label>Inserisci il cognome</label>
                            <input type="text" name="cognome" placeholder="cognome" onChange={(e) => setCognome(e.target.value)} required/>
                        </div>
                        <div className="input">
                            <label>Inserisci l'email</label>
                            <input type="email" name="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} required/>
                        </div>
                        <div className="input">
                            <label>Inserisci la password</label>
                            <input name="password" placeholder="password"  onChange={(e) => setPassword(e.target.value)} 
                            
                            id="pass"
                            type={
                                showPassword ? "text" : "password"
                            }
                            
                            required/>
                        </div>
                        <div>
                        <label for="check">Show Password</label>
                            <input
                                id="check"
                                type="checkbox"
                                value={showPassword}
                                onChange={() =>
                                    setShowPassword((prev) => !prev)
                                }
                            />
                        </div>
                        <div className="input">
                            <label>Conferma password</label>
                            <input type="password" name="conferma-password" placeholder="conferma password" onChange={(e) => setConfermaPassword(e.target.value)} required/>
                        </div>
                        <div className="button">
                            <input type="submit" value="Invia" className="submit" disabled={!(emailValid && passwordValid && nomeValid && cognomeValid && confermaPasswordValid)} />
                            <input type="reset" value="Cancella" className="reset" onClick={resetInput} />
                        </div>
                    </form>
                </div>
            )}  
        </div>
    );
}

export default SignIn;