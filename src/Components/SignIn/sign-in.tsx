import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';
import { useAuth } from "../../AuthContext.tsx"; // Adjust this import path as needed
import './sign-in.css'; // Make sure this path is correct

const SignIn: React.FC = () => {
    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [dataNascita, setDataNascita] = useState('');
    const [targa, setTarga] = useState('');
    const [type, setType] = useState('password');
    const [icon, setIcon] = useState(eyeOff);
    const [isRegistering, setIsRegistering] = useState(false);

    const handleToggle = () => {
        setType(type === 'password' ? 'text' : 'password');
        setIcon(type === 'password' ? eye : eyeOff);
    };

    const resetInput = () => {
        setEmail('');
        setPassword('');
        setNome('');
        setCognome('');
        setDataNascita('');
        setTarga('');
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if (isRegistering) {
                await signUp(email, password, {
                    nome,
                    cognome,
                    data_di_nascita: dataNascita,
                    targa
                });
                alert("Registration successful! Please check your email to verify your account.");
                setIsRegistering(false);
            } else {
                await signIn(email, password);
                navigate('/dashboard'); // Redirect to dashboard after successful login
            }
        } catch (error) {
            alert(error instanceof Error ? error.message : 'An error occurred');
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <h1>{isRegistering ? "Sign Up" : "Login"}</h1>
                
                {isRegistering && (
                    <>
                        <div className="input">
                            <label>Nome</label>
                            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
                        </div>
                        <div className="input">
                            <label>Cognome</label>
                            <input type="text" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
                        </div>
                        <div className="input">
                            <label>Data di nascita</label>
                            <input type="date" value={dataNascita} onChange={(e) => setDataNascita(e.target.value)} required />
                        </div>
                        <div className="input">
                            <label>Targa veicolo</label>
                            <input type="text" value={targa} onChange={(e) => setTarga(e.target.value)} required />
                        </div>
                    </>
                )}

                <div className="input">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="input password-input">
                    <label>Password</label>
                    <input type={type} value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <span onClick={handleToggle} className="icon-container">
                        <Icon icon={icon} size={25} />
                    </span>
                </div>
                <div className="button">
                    <input type="submit" value={isRegistering ? "Sign Up" : "Login"} className="submit" />
                    <input type="reset" value="Cancel" className="reset" onClick={resetInput} />
                </div>
                <p>
                    {isRegistering ? "Already have an account? " : "Don't have an account? "}
                    <a onClick={() => setIsRegistering(!isRegistering)}>
                        {isRegistering ? "Login" : "Sign Up"}
                    </a>
                </p>
            </form>
        </div>
    );
}

export default SignIn;