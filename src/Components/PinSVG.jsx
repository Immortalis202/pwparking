import React from "react";

function Icon({colorCircle, colorOutside}) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="21.333"
			height="37.218"
			version="1.1"
			viewBox="0 0 20 34.892"
		>
			<g transform="translate(-814.596 -274.386)">
				<g
					fillOpacity="1"
					transform="matrix(1.18559 0 0 1.18559 -151.177 -57.398)"
				>
					<path
						fill={colorOutside}
						stroke="#d73534"
						strokeDasharray="none"
						strokeMiterlimit="4"
						strokeOpacity="1"
						strokeWidth="1"
						d="M817.112 282.971c-1.258 1.343-2.046 3.299-2.015 5.139.064 3.845 1.797 5.3 4.568 10.592.999 2.328 2.04 4.792 3.031 8.873.138.602.272 1.16.335 1.21.062.048.196-.513.334-1.115.99-4.081 2.033-6.543 3.031-8.871 2.771-5.292 4.504-6.748 4.568-10.592.031-1.84-.759-3.798-2.017-5.14-1.437-1.535-3.605-2.67-5.916-2.717-2.312-.048-4.481 1.087-5.919 2.621z"
						display="inline"
						opacity="1"
					></path>
					<circle
						cx="823.031"
						cy="288.253"
						r="3.035"
						fill={colorCircle}
						strokeWidth="0"
						display="inline"
						opacity="1"
					></circle>
				</g>
			</g>
		</svg>
	);
}

export default Icon;
