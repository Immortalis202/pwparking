import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	APIProvider,
	Map,
	MapCameraChangedEvent,
	AdvancedMarker,
	Pin,
	useMap,
	InfoWindow,
} from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import type { Marker } from "@googlemaps/markerclusterer";	
import { supabase } from "./supabaseClient";
import useDeviceInfo from "./deviceInfo";

const containerStyle = {
	width: "50rem",
	height: "600px",
	margin: "60px",
};

const zoneCoords = [
	[
		{ lat: 45.48597, lng: 9.21704 },
		{ lat: 45.49401, lng: 9.2004 },
		{ lat: 45.49755, lng: 9.18685 },
		{ lat: 45.49655, lng: 9.17071 },
		{ lat: 45.49849, lng: 9.16488 },
		{ lat: 45.47169, lng: 9.18254 },
	],
	[
		{ lat: 45.48597, lng: 9.21704 },
		{ lat: 45.46245, lng: 9.21728 },
		{ lat: 45.45894, lng: 9.21751 },
		{ lat: 45.45593, lng: 9.2168 },
		{ lat: 45.44722, lng: 9.21036 },
		{ lat: 45.47169, lng: 9.18254 },
	],
	[
		{ lat: 45.44722, lng: 9.21036 },
		{ lat: 45.44574481288493, lng: 9.18750325407903 },

		{ lat: 45.44349, lng: 9.18015 },
		{ lat: 45.44477, lng: 9.16281 },
		{ lat: 45.44709, lng: 9.15824 },
		{ lat: 45.47169, lng: 9.18254 },
	],
	[
		{ lat: 45.44709, lng: 9.15824 },
		{ lat: 45.44925, lng: 9.15723 },
		{ lat: 45.4502, lng: 9.15554 },
		{ lat: 45.46724, lng: 9.14608 },
		{ lat: 45.47599, lng: 9.14327 },
		{ lat: 45.47169, lng: 9.18254 },
	],
	[
		{ lat: 45.47599, lng: 9.14327 },
		{ lat: 45.48449, lng: 9.14342 },
		{ lat: 45.49849, lng: 9.16488 },
		{ lat: 45.47169, lng: 9.18254 },
	],
];

type Poi = {
	key: string;
	location: google.maps.LatLngLiteral;
	isOccupied: boolean;
	isElectric: boolean;
};

interface TravelInfo {
	duration: string;
	arrivalTime: string;
}
const locations: Poi[] = [];

export default function MapG() {
	const [locations, setLocations] = useState<Poi[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPark = async () => {
			try {
				const { data, error } = await supabase
					.from("fetchelementformaps")
					.select(
						"numero_del_parcheggio, latitude, longitude, colonnina, isoccupied"
					);
				if (error) {
					throw error;
				}
				const formPark: Poi[] = data.map((item: any) => ({
					key: item.numero_del_parcheggio.toString(),
					location: {
						lat: item.latitude,
						lng: item.longitude,
					},
					isElectric: item.colonnina,
					isOccupied: item.isoccupied,
				}));

				setLocations(formPark);
			} catch (error: unknown) {
				if (error instanceof Error) {
					setError(error.message);
				} else {
					setError("error");
				}
			} finally {
				setLoading(false);
			}
		};
		fetchPark();
	}, []);

	return (
		<APIProvider
			apiKey={""}
			onLoad={() => console.log("Maps API has loaded.")}
		>
			<Map
				mapId={"209c91d70750a3c"}
				style={containerStyle}
				defaultZoom={13}
				defaultCenter={{ lat: 45.47169, lng: 9.18254 }}
			>
				<PoiMarkers pois={locations} />
				<MapComponent num={0} color={"#FF0000"} />
				<MapComponent num={1} color={"#00FF00"} />
				<MapComponent num={2} color={"#FF00FF"} />
				<MapComponent num={3} color={"#0000FF"} />
				<MapComponent num={4} color={"#FFFF00"} />
			</Map>
		</APIProvider>
	);
}

const TravelInfoWindow: React.FC<{ travelInfo: TravelInfo | null }> = ({
	travelInfo,
}) => {
	if (!travelInfo) return null;

	return (
		<div
			style={{
				position: "absolute",
				bottom: "20px",
				left: "20px",
				backgroundColor: "white",
				padding: "10px",
				borderRadius: "5px",
				boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
				zIndex: 1000,
			}}
		>
			<h3>Travel Information</h3>
			<p>Duration: {travelInfo.duration}</p>
			<p>Estimated Arrival: {travelInfo.arrivalTime}</p>
		</div>
	);
};

const PoiMarkers = (props: { pois: Poi[] }) => {
	const map = useMap();
	const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
	const clusterer = useRef<MarkerClusterer | null>(null);
	const [selectedPoi, setSelectedPoi] = useState<Poi | null>(null);
	const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
		null
	);
	const [travelInfo, setTravelInfo] = useState<TravelInfo | null>(null);
	const deviceInfo = useDeviceInfo();

	const openExternalNavigation = () => {
		if (!selectedPoi) return;

		const { lat, lng } = selectedPoi.location;
		let url;

		if (deviceInfo.isMobile && /android/i.test(deviceInfo.userAgent)) {
			// For Android devices, open Google Maps app
			url = `google.navigation:q=${lat},${lng}`;
		} else {
			// For other devices, open Google Maps in browser
			url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
		}

		window.open(url, "_blank");
	};

	useEffect(() => {
		if (!map) return;
		if (!clusterer.current) {
			clusterer.current = new MarkerClusterer({ map });
		}
	}, [map]);

	useEffect(() => {
		clusterer.current?.clearMarkers();
		clusterer.current?.addMarkers(Object.values(markers));
	}, [markers]);

	const handleClick = useCallback(
		(poi: Poi) => {
			if (!map) return;
			map.panTo(poi.location);
			setSelectedPoi(poi);
		},
		[map]
	);

	const setMarkerRef = (marker: Marker | null, key: string) => {
		if (marker && markers[key]) return;
		if (!marker && !markers[key]) return;

		setMarkers((prev) => {
			if (marker) {
				return { ...prev, [key]: marker };
			} else {
				const newMarkers = { ...prev };
				delete newMarkers[key];
				return newMarkers;
			}
		});
	};
	const clearExistingRoute = () => {
		if (directionsRendererRef.current) {
			directionsRendererRef.current.setMap(null);
			directionsRendererRef.current = null;
		}
		setTravelInfo(null);
	};

	const startNavigation = () => {
		if (!selectedPoi || !map) return;

		clearExistingRoute();

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const directionsService =
						new google.maps.DirectionsService();
					const directionsRenderer =
						new google.maps.DirectionsRenderer();

					directionsRenderer.setMap(map);
					directionsRendererRef.current = directionsRenderer;

					const request: google.maps.DirectionsRequest = {
						origin: new google.maps.LatLng(
							position.coords.latitude,
							position.coords.longitude
						),
						destination: selectedPoi.location,
						travelMode: google.maps.TravelMode.DRIVING,
					};

					directionsService.route(request, (result, status) => {
						if (
							status === google.maps.DirectionsStatus.OK &&
							result
						) {
							directionsRenderer.setDirections(result);

							// Calculate arrival time
							const now = new Date();
							const durationInSeconds =
								result.routes[0].legs[0].duration?.value || 0;
							const arrivalTime = new Date(
								now.getTime() + durationInSeconds * 1000
							);

							setTravelInfo({
								duration:
									result.routes[0].legs[0].duration?.text ||
									"Unknown",
								arrivalTime: arrivalTime.toLocaleTimeString(
									[],
									{ hour: "2-digit", minute: "2-digit" }
								),
							});
						}
					});
				},
				() => {
					alert("Error: The Geolocation service failed.");
				}
			);
		} else {
			alert("Error: Your browser doesn't support geolocation.");
		}
	};

	// Clear the route when the component unmounts
	useEffect(() => {
		return () => {
			clearExistingRoute();
		};
	}, []);

	return (
		<>
			{props.pois.map((poi: Poi) => (
				<AdvancedMarker
					key={poi.key}
					position={poi.location}
					ref={(marker) => setMarkerRef(marker, poi.key)}
					clickable={true}
					onClick={() => handleClick(poi)}
				>
					<Pin
						background={poi.isOccupied ? "#3C3C3C" : "#FF0000"}
						glyphColor={poi.isElectric ? "#0F0" : "#000"}
						borderColor={"#000"}
					/>
				</AdvancedMarker>
			))}
			{selectedPoi && (
				<InfoWindow
					position={selectedPoi.location}
					onCloseClick={() => {
						setSelectedPoi(null);
						clearExistingRoute();
					}}
				>
					<div>
						<h3>Parking Spot {selectedPoi.key}</h3>
						<p>
							{selectedPoi.isOccupied ? "Occupied" : "Available"}
						</p>
						<p>
							{selectedPoi.isElectric
								? "Electric Charging Available"
								: "No Electric Charging"}
						</p>
						<button onClick={startNavigation}>Navigate Here</button>
						<button onClick={openExternalNavigation}>
							Open in{" "}
							{deviceInfo.isMobile &&
							/android/i.test(deviceInfo.userAgent)
								? "Google Maps App"
								: "Google Maps"}
						</button>
					</div>
				</InfoWindow>
			)}

			<TravelInfoWindow travelInfo={travelInfo} />
		</>
	);
};

const MapComponent = ({ num, color }: { num: number; color: string }) => {
	const mapRef = useRef(null);
	const map = useMap();

	useEffect(() => {
		if (map) {
			// Add a polygon
			const polygon = new google.maps.Polygon({
				paths: zoneCoords[num],
				strokeColor: color,
				strokeOpacity: 0.8,
				strokeWeight: 2,
				fillColor: color,
				fillOpacity: 0.25,
			});

			polygon.setMap(map);
		}
	}, [map]);
	return <div ref={mapRef} style={containerStyle}></div>;
};
