import React, { useState, useEffect } from 'react';
import supabase from './../Components/supabase';
import { useOutletContext } from 'react-router-dom';
import './../App.css';
import { Outlet, Link } from 'react-router-dom';

const Profilo = () => {
    const { userEmail, setUser } = useOutletContext();
    const [isLoading, setIsLoading] = useState(true);
    const [userInformation, setUserInformation] = useState({});
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        const fetchUserInformation = async () => {
            setIsLoading(true);
            try {
                // Recupera informazioni dell'utente
                const { data: user, error: userError } = await supabase
                    .from('utenti')
                    .select('*')
                    .eq('email', userEmail)
                    .single();

                if (userError) {
                    console.error('Errore nel recuperare l\'utente:', userError.message);
                    setIsLoading(false);
                    return;
                }

                setUserInformation(user);

                // Recupera veicoli associati all'utente
                const { data: vehiclesData, error: vehiclesError } = await supabase
                    .from('veicoli_utenti')
                    .select('veicoli (targa)')
                    .eq('id_utente', user.id);

                if (vehiclesError) {
                    console.error('Errore nel recuperare i veicoli:', vehiclesError.message);
                    setIsLoading(false);
                    return;
                }

                setVehicles(vehiclesData.map(vehicle => vehicle.veicoli));

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
                    <span aria-busy="true">Generazione delle tue informazioni...</span>
                ) : (
                    <div>
                        <p>Nome: {userInformation.nome}</p>
                        <p>Cognome: {userInformation.cognome}</p>
                        <p>Data di nascita: {userInformation.data_di_nascita}</p>
                        <p>Email: {userInformation.email}</p>
                        <p>Veicoli:</p>
                        <ul>
                            {vehicles.map(vehicle => (
                                <li key={vehicle.id}>{vehicle.targa}</li>
                            ))}
                        </ul>
                        <hr />
                    </div>
                )}
                <Link to="../"><button className='logoutButton' onClick={logout}>Logout</button></Link>
            </hgroup>
        </div>
    );
};

export default Profilo;
