import { useState, useEffect } from "react";

interface DeviceInfo {
	userAgent: string;
	platform: string;
	screenWidth: number;
	screenHeight: number;
	viewportWidth: number;
	viewportHeight: number;
	devicePixelRatio: number;
	isOnline: boolean;
	browserName: string;
	browserVersion: string;
	isMobile: boolean;
	isTablet: boolean;
	isDesktop: boolean;
}

const useDeviceInfo = (): DeviceInfo => {
	const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
		userAgent: "",
		platform: "",
		screenWidth: 0,
		screenHeight: 0,
		viewportWidth: 0,
		viewportHeight: 0,
		devicePixelRatio: 1,
		isOnline: false,
		browserName: "",
		browserVersion: "",
		isMobile: false,
		isTablet: false,
		isDesktop: false,
	});

	useEffect(() => {
		const updateDeviceInfo = () => {
			const ua = navigator.userAgent;
			const platform = navigator.platform;
			const screenWidth = window.screen.width;
			const screenHeight = window.screen.height;
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;
			const devicePixelRatio = window.devicePixelRatio;
			const isOnline = navigator.onLine;

			// Detect browser name and version
			const browserInfo = ((): { name: string; version: string } => {
				const ua = navigator.userAgent;
				let match =
					ua.match(
						/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
					) || [];
				let temp;

				if (/trident/i.test(match[1])) {
					temp = /\brv[ :]+(\d+)/g.exec(ua) || [];
					return { name: "IE", version: temp[1] || "" };
				}

				if (match[1] === "Chrome") {
					temp = ua.match(/\bOPR|Edge\/(\d+)/);
					if (temp != null) {
						return { name: "Opera", version: temp[1] };
					}
				}

				match = match[2]
					? [match[1], match[2]]
					: [navigator.appName, navigator.appVersion, "-?"];
				temp = ua.match(/version\/(\d+)/i);
				if (temp != null) {
					match.splice(1, 1, temp[1]);
				}

				return { name: match[0], version: match[1] };
			})();

			// Detect device type
			const isMobile =
				/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
					ua
				);
			const isTablet =
				/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua);
			const isDesktop = !isMobile && !isTablet;

			setDeviceInfo({
				userAgent: ua,
				platform,
				screenWidth,
				screenHeight,
				viewportWidth,
				viewportHeight,
				devicePixelRatio,
				isOnline,
				browserName: browserInfo.name,
				browserVersion: browserInfo.version,
				isMobile,
				isTablet,
				isDesktop,
			});
		};

		updateDeviceInfo();

		window.addEventListener("resize", updateDeviceInfo);
		window.addEventListener("online", updateDeviceInfo);
		window.addEventListener("offline", updateDeviceInfo);

		return () => {
			window.removeEventListener("resize", updateDeviceInfo);
			window.removeEventListener("online", updateDeviceInfo);
			window.removeEventListener("offline", updateDeviceInfo);
		};
	}, []);

	return deviceInfo;
};

export default useDeviceInfo;
