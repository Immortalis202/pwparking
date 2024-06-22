import React, { useState, useEffect } from 'react';
import supabase from './../Components/supabase';
import { useOutletContext } from 'react-router-dom';

const Profilo = () => {
    const { userEmail, setUser } = useOutletContext();
    const [isLoading, setIsLoading] = useState(true);
    const [userInformation, setUserInformation] = useState({}); // Inizializza come oggetto vuoto {}

    useEffect(() => {
        const fetchUserInformation = async () => {
            setIsLoading(true);
            try {
                let { data: user, error: userError } = await supabase
                    .from('utenti')
                    .select('*')
                    .eq('email', userEmail)
                    .single();

                if (userError) {
                    console.error('Errore nel recuperare l\'utente: ' + userError.message);
                    setIsLoading(false);
                    return;
                }

                setUserInformation(user);
                setIsLoading(false);
            } catch (error) {
                console.error('Errore nel fetch delle informazioni utente:', error.message);
                setIsLoading(false);
            }
        };

        if (userEmail) {
            fetchUserInformation();
        }
    }, [userEmail]);

    const logout = () => {
        setUser('');
    };

    return (
        <div>
            <hgroup>
                <h2>Profilo utente</h2>
                <hr />
                {isLoading ? (
                    <p>Caricamento...</p>
                ) : (
                    <div>
                        <p>Nome: {userInformation.nome}</p>
                        <p>Cognome: {userInformation.cognome}</p>
                        <p>Data di nascita: {userInformation.data_di_nascita}</p>
                        <p>Email: {userInformation.email}</p>
                        <hr />
                    </div>
                )}
                <button onClick={logout}>Logout</button>
            </hgroup>
        </div>
    );
}

export default Profilo;
