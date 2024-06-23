import React, { useState, useEffect } from 'react';
import supabase from './../Components/supabase';
import { useOutletContext } from 'react-router-dom';

const Profilo = () => {
    const { userEmail, setUser } = useOutletContext();
    const [isLoading, setIsLoading] = useState(true);
    const [userInformation, setUserInformation] = useState({});
    const [vehicleInformation, setVehicleInformation] = useState('');

    useEffect(() => {
        const fetchUserInformation = async () => {
            setIsLoading(true);
            try {
                const { data: user, error: userError } = await supabase
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

                const { data: vehicle, error: vehicleError } = await supabase
                    .from('veicoli_utenti')
                    .select('*')
                    .eq('id_utente', user.id)
                    .single();

                if (vehicleError) {
                    console.error('Errore nel recuperare il veicolo: ' + vehicleError.message);
                    setIsLoading(false);
                    return;
                }

                const vehicleId = vehicle.id;

                const { data: vehiclePlate, error: vehiclePlateError } = await supabase
                    .from('veicoli')
                    .select('*')
                    .eq('id', vehicleId)
                    .single();

                if (vehiclePlateError) {
                    console.error('Errore nel recuperare il veicolo: ' + vehiclePlateError.message);
                    setIsLoading(false);
                    return;
                }

                setVehicleInformation(vehiclePlate.targa);
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
                        <p>Targa veicolo: {vehicleInformation}</p>
                        <hr />
                    </div>
                )}
                <button onClick={logout}>Logout</button>
            </hgroup>
        </div>
    );
};

export default Profilo;
