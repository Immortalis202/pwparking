import React, { useState, useEffect } from "react";
import './sign-in.css';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import supabase from './../supabase';

const SignIn = ({ setUser }) => {
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nomeValid, setNomeValid] = useState(false);
    const [cognomeValid, setCognomeValid] = useState(false);
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const [dataNascita, setDataNascita] = useState('');

    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);

    const [registrazioneLogin, setRegistrazioneLogin] = useState(true);

    const login = async (event) => {
        event.preventDefault();
    
        const { user, session, error } = await supabase.auth.signIn({ email, password });
    
        if (error) {
            console.error('Errore durante il login:', error.message);
            alert('Errore durante il login: ' + error.message);
            return;
        }
    
        if (user) {
            console.log('Login avvenuto con successo:', user);
            setUser(user);
        } else {
            console.error('Errore imprevisto durante il login.');
            alert('Errore imprevisto durante il login.');
        }
    };

    const registrazione = async (event) => {
        event.preventDefault();
        
        try {
            // Verifica se l'email è già registrata
            const { data: existingUser, error: checkError } = await supabase
                .from('utenti')
                .select('email')
                .eq('email', email)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                console.error('Errore durante la verifica della email:', checkError);
                return;
            }

            if (existingUser) {
                alert('L\'email è già registrata. Effettua il login.');
                return;
            }

            // Inserisci il nuovo utente
            const { data, error: insertError } = await supabase
                .from('utenti')
                .insert([
                    { nome, cognome, data_di_nascita: dataNascita, email, password, id_tipologia: 1 },
                ])
                .select();

            if (insertError) {
                console.error('Errore durante la registrazione:', insertError);
            } else {
                console.log('Registrazione avvenuta con successo:', data);
                setUser(email);
            }
        } catch (error) {
            console.error('Errore inaspettato:', error);
        }
    };

    const changeForm = () => {
        setRegistrazioneLogin((v) => !v);
    };

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

    const validateNome = () => {
        const pattern = /^[a-zA-Z]+$/;
        setNomeValid(pattern.test(nome));
    };

    const validateCognome = () => {
        const pattern = /^[a-zA-Z]+$/;
        setCognomeValid(pattern.test(cognome));
    };

    const validateEmail = () => {
        const pattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
        setEmailValid(pattern.test(email));
    };

    const validatePassword = () => {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
        setPasswordValid(pattern.test(password));
    };

    const handleToggle = () => {
        if (type === 'password') {
            setIcon(eye);
            setType('text');
        } else {
            setIcon(eyeOff);
            setType('password');
        }
    };

    const resetInput = () => {
        setNome('');
        setCognome('');
        setEmail('');
        setPassword('');
        setDataNascita('');
        setNomeValid(false);
        setCognomeValid(false);
        setEmailValid(false);
        setPasswordValid(false);
    };

    return (
        <>
            {registrazioneLogin ? (
                <div className="form-container">
                    <form method="post" onSubmit={login}>
                        <h1>Login</h1>
                        <div className="input">
                            <label>Inserisci l'email</label>
                            <input type="email" name="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="input password-input">
                            <label>Inserisci la password</label>
                            <input
                                type={type}
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <span onClick={handleToggle} className="icon-container">
                                <Icon icon={icon} size={25} />
                            </span>
                        </div>
                        <div className="button">
                            <input type="submit" value="Invia" className="submit" disabled={!(emailValid && passwordValid)} />
                            <input type="reset" value="Cancella" className="reset" onClick={resetInput} />
                        </div>
                        <p>Non sei registrato? <a onClick={changeForm}>Registrati</a></p>
                    </form>
                </div>
            ) : (
                <div className="form-container">
                    <form method="post" onSubmit={registrazione}>
                        <h1>Sign Up</h1>
                        <div className="input">
                            <label>Inserisci il nome</label>
                            <input type="text" name="nome" placeholder="nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                        </div>
                        <div className="input">
                            <label>Inserisci il cognome</label>
                            <input type="text" name="cognome" placeholder="cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
                        </div>
                        <div>
                            <label>Data di nascita</label>
                            <input type="date" name="date" aria-label="Date" onChange={(e) => setDataNascita(e.target.value)} required />
                        </div>
                        <div className="input">
                            <label>Inserisci l'email</label>
                            <input type="email" name="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="input password-input">
                            <label>Inserisci la password</label>
                            <input
                                type={type}
                                name="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <span onClick={handleToggle} className="icon-container">
                                <Icon icon={icon} size={25} />
                            </span>
                        </div>
                        <div className="button">
                            <input type="submit" value="Invia" className="submit" disabled={!(emailValid && passwordValid && nomeValid && cognomeValid)} />
                            <input type="reset" value="Cancella" className="reset" onClick={resetInput} />
                        </div>
                        <p>Sei già registrato? <a onClick={changeForm}>Effettua il login</a></p>
                    </form>
                </div>
            )
            }
        </>
    );
}

export default SignIn;
