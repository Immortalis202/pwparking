import React, { useEffect, useState } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { supabase } from "./supabase.ts";
import { useAuth } from "../AuthContext.tsx"; // Import useAuth hook

interface Params {
	area: string | null;
	parking: string | null;
}

type Ticket = {
	key: number;
	idParcheggio: number;
	parcheggio: number;
	dataInizio: string;
	dataFine: string;
	utente: number;
};

const URLParameterDisplay: React.FC = () => {
	const [searchParams] = useSearchParams();
	const [params, setParams] = useState<Params>({ area: null, parking: null });
	const [currentTime, setCurrentTime] = useState<string>("");
	const [ticket, setTicket] = useState<Ticket[]>([]);
	const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [scannedPark, setScannedPark] = useState<number>();

	// Use the AuthContext
	const { user } = useAuth();

	useEffect(() => {
		const fetchTickets = async () => {
			try {
				const { data, error } = await supabase.from("ticket").select(`
            id,
            id_parcheggio,
            id_utente,
            data_ora_inizio,
            data_ora_fine,
            parcheggi (
              id,
              numero_del_parcheggio
            )
          `);
				if (error) throw error;

				const formattedTickets: Ticket[] = data.map((item: any) => ({
					key: item.id,
					idParcheggio: item.id_parcheggio,
					parcheggio: item.parcheggi.numero_del_parcheggio,
					dataInizio: item.data_ora_inizio,
					dataFine: item.data_ora_fine,
					utente: item.id_utente,
				}));
				console.log(formattedTickets);
				setTicket(formattedTickets);
			} catch (error: unknown) {
				setError(
					error instanceof Error ? error.message : "An error occurred"
				);
			} finally {
				setLoading(false);
			}
		};

		if (user) {
			fetchTickets();
		}
	}, [user]);

	useEffect(() => {
		const area = searchParams.get("area");
		const parking = searchParams.get("parking");
		setParams({ area, parking });
		const parkingNumber = `${area || ""}${parking || ""}`;
		const intParkingNumber = parseInt(parkingNumber, 10);
		setScannedPark(intParkingNumber);
	}, [searchParams]);

	useEffect(() => {
		const updateTime = () => {
			setCurrentTime(new Date().toLocaleTimeString());
		};
		updateTime();
		const timerId = setInterval(updateTime, 1000);
		return () => clearInterval(timerId);
	}, []);

	useEffect(() => {
		if (scannedPark && user) {
			const foundTicket = ticket.find(
				(tick) =>
					scannedPark === tick.parcheggio &&
					
					new Date(tick.dataFine) > new Date()
			);
			setActiveTicket(foundTicket || null);
		}
	}, [scannedPark, ticket, user]);

	if (!user) {
		return <Navigate to="/login" />;
	}

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	if (activeTicket) {
		return (
			<div className="p-4 bg-gray-100 rounded-lg shadow">
                
				<h1 className="text-2xl font-bold mb-4">Active Ticket</h1>
				<p>Parking: {activeTicket.parcheggio}</p>
				<p>
					Start Time:{" "}
					{new Date(activeTicket.dataInizio).toLocaleString()}
				</p>
				<p>
					End Time: {new Date(activeTicket.dataFine).toLocaleString()}
				</p>
				<button className="mt-4 bg-red-500 text-white p-2 rounded">
					End Ticket
				</button>
			</div>
		);
	}

	return (
		<div className="p-4 bg-gray-100 rounded-lg shadow">
             
			<h1 className="text-2xl font-bold mb-4">Start Ticket</h1>
			<p className="mb-2">
				<strong>Area:</strong> {params.area || "Not specified"}
			</p>
			<p>
				<strong>Parking:</strong> {params.parking || "Not specified"}
			</p>
			<div className="mt-4 p-2 bg-blue-100 rounded">
				<p className="text-lg font-semibold">
					Current Time: {currentTime}
				</p>
			</div>
			<button className="mt-4 bg-green-500 text-white p-2 rounded">
				Start Ticket
			</button>
		</div>
	);
};

export default URLParameterDisplay;
