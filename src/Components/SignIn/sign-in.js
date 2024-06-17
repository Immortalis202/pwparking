import React , {useState} from "react";
import './sign-in.css';

const SignIn = () => {
    const validateEmail = () => {
        const [email, setEmail] = useState('');
        const pattern = "^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$";
    }
    const validatePassword = () => {
        const [password, setPassword] = useState('');
        const pattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$";
    }
    return (
        <div>
            <form method="post">
                <div>
                    <label>Inserisci l'email</label>
                    <input type="email" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Inserisci la password</label>
                    <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div>
                    <input type="submit" value="Invia" />
                    <input type="reset" value="Cancella" />
                </div>
            </form>
        </div>
    );
}

export default SignIn;

