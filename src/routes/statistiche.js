import React, { useState, useEffect } from 'react';
import supabase from './../Components/supabase';
import { useOutletContext } from 'react-router-dom';

const Statistiche = () => {
  const { userEmail } = useOutletContext();
  const [usersTickets, setUsersTickets] = useState([]);

  const oldTickets = async () => {
    if (!userEmail) {
      console.error('Email dell\'utente non trovata.');
      return;
    }

    // Recupera l'ID dell'utente basato sull'email
    let { data: user, error: userError } = await supabase
      .from('utenti')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError) {
      console.error('Errore nel recuperare l\'utente: ' + userError.message);
      return;
    }

    const userId = user.id;

    // Recupera i ticket dell'utente basato sull'ID utente
    let { data: tickets, error: ticketsError } = await supabase
      .from('ticket')
      .select('*')
      .eq('id_utente', userId);

    if (ticketsError) {
      console.error('Errore nel recuperare i ticket: ' + ticketsError.message);
      return;
    }

    setUsersTickets(tickets);
  };

  useEffect(() => {
    oldTickets();
  }, [userEmail]);

  return (
    <div>
      <hgroup>
        <h2>Parcheggi effettuati</h2>
        {usersTickets.length > 0 ? (
          <ul>
            {usersTickets.map(ticket => (
              <li key={ticket.id}>
                Ticket ID: {ticket.id}, Inizio: {ticket.data_ora_inizio}, Fine: {ticket.data_ora_fine}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nessun ticket trovato</p>
        )}
      </hgroup>
    </div>
  );
};

export default Statistiche;
