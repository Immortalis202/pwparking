import React, { useState, useEffect } from 'react';
import { supabase } from './../Components/supabase.ts';
import './../App.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.tsx'; 

const Profilo = () => {
    const { user, signOut } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [userInformation, setUserInformation] = useState({});
    const [vehicles, setVehicles] = useState([]);
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const fetchUserInformation = async () => {
            setIsLoading(true);
            try {
                // Recupera informazioni dell'utente
                const { data: userData, error: userError } = await supabase
                    .from('utenti')
                    .select('*')
                    .eq('email', user?.email)
                    .single();

                if (userError) {
                    console.error('Errore nel recuperare l\'utente:', userError.message);
                    setIsLoading(false);
                    return;
                }

                setUserInformation(userData);

                // Recupera veicoli associati all'utente
                const { data: vehiclesData, error: vehiclesError } = await supabase
                    .from('veicoli_utenti')
                    .select('veicoli (targa)')
                    .eq('id_utente', userData.id);

                if (vehiclesError) {
                    console.error('Errore nel recuperare i veicoli:', vehiclesError.message);
                    setIsLoading(false);
                    return;
                }

                setVehicles(vehiclesData.map(vehicle => vehicle.veicoli));

                const { data: cardsData, error: cardsError } = await supabase
                .from('carte_utente')
                .select('carte (id)')
                .eq('id_utente', userData.id);

            if (cardsError) {
                console.error('Errore nel recuperare le carte:', cardsError.message);
                setIsLoading(false);
                return;
            }

            setCards(cardsData.map(card => card.carte));


                setIsLoading(false);
            } catch (error) {
                console.error('Errore nel fetch delle informazioni utente:', error.message);
                setIsLoading(false);
            }
        };

        if (user) {
            fetchUserInformation();
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Errore durante il logout:', error);
        }
    };

    if (!user) {
        return <div>Please log in to view your profile.</div>;
    }

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
                            {vehicles.map((vehicle, index) => (
                                <li key={index}>{vehicle.targa}</li>
                            ))}
                        </ul>
                        <p>Carte:</p>

                        //TODO CONTROLLARE 
                        <ul>
                            {cards.map((card, index) => (
                                <li key={index}>{card.numero}</li>
                            ))}
                        </ul>
                        <hr />
                    </div>
                )}
                <Link to="../"><button className='logoutButton' onClick={handleLogout}>Logout</button></Link>
            </hgroup>
        </div>
    );
};

export default Profilo;