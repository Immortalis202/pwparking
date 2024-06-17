import React from "react";

const SignIn = () => {
    return (
        <div>
            <form>
                <div>
                    <label>Inserisci l'email</label>
                    <input type="text" placeholder="email" />
                </div>
                <div>
                    <label>Inserisci la password</label>
                    <input type="password" placeholder="password" />
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

