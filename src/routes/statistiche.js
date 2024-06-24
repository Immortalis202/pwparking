import React, { useState, useEffect } from 'react';
import supabase from './../Components/supabase';
import { useOutletContext } from 'react-router-dom';

const Statistiche = () => {
  const { userEmail } = useOutletContext();
  const [usersTickets, setUsersTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //ticket modificato
  const isPastTicket = (ticket) => {
    const now = new Date();
    const ticketEndDate = new Date(ticket.data_ora_fine);

    if (ticket.data_ora_fine === null) {
      return false; // Ticket is in progress
    }
    return true;
  };

  const oldTickets = async () => {
    setIsLoading(true);
    if (!userEmail) {
      console.error('Email dell\'utente non trovata.');
      setIsLoading(false);
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
      setIsLoading(false);
      return;
    }

    const userId = user.id;

    // Recupera i ticket dell'utente basato sull'ID utente
    let { data: tickets, error: ticketsError } = await supabase
      .from('ticket')
      .select('id, data_ora_inizio, data_ora_fine, id_parcheggio')
      .eq('id_utente', userId)
      .order('data_ora_inizio', { ascending: false });

    if (ticketsError) {
      console.error('Errore nel recuperare i ticket: ' + ticketsError.message);
      setIsLoading(false);
      return;
    }

    // Ottieni i numeri dei parcheggi basati sugli id_parcheggio dei ticket
    let ticketsWithParcheggi = [];
    for (let ticket of tickets) {
      let { data: parcheggio, error: parcheggioError } = await supabase
        .from('parcheggi')
        .select('numero_del_parcheggio')
        .eq('id', ticket.id_parcheggio)
        .single();

      if (parcheggioError) {
        console.error('Errore nel recuperare il parcheggio: ' + parcheggioError.message);
        setIsLoading(false);
        continue;
      }

      ticketsWithParcheggi.push({
        ...ticket,
        numero_del_parcheggio: parcheggio.numero_del_parcheggio
      });
    }

    setUsersTickets(ticketsWithParcheggi);
    setIsLoading(false);
  };

  useEffect(() => {
    oldTickets();
  }, [userEmail]);

  return (
    <div>
      <hgroup>
        <h2>Parcheggi effettuati</h2>
        {isLoading ? (
          <span aria-busy="true">Generating your old tickets</span>
        ) : (
          usersTickets.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Num. parcheggio</th>
                  <th>Inizio</th>
                  <th>Fine</th>
                </tr>
              </thead>
              <tbody>
              {usersTickets.map(ticket => (
                  <tr key={ticket.id}>
                    {isPastTicket(ticket) ? (
                      <>
                        <td>{ticket.numero_del_parcheggio}</td>
                        <td>{ticket.data_ora_inizio}</td>
                        <td>{ticket.data_ora_fine}</td>
                      </>
                    ) : (
                      <>
                        <td>{ticket.numero_del_parcheggio}</td>
                        <td>{ticket.data_ora_inizio}</td>
                        <td>In Corso</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nessun ticket trovato</p>
          )
        )}
      </hgroup>
    </div>
  );
};

export default Statistiche;
