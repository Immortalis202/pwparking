import React, { useState, useEffect, useRef } from "react";
import qrcodegen from "./qrcodegen";
import ImageWithNumberCanvas from "./canva";
import "./App.css";

const QRCodeGenerator = () => {
	const [text, setText] = useState("http://localhost:3000/");
	const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("high");
	const [outputFormat, setOutputFormat] = useState("bitmap");
	const [border, setBorder] = useState(4);
	const [scale, setScale] = useState(8);
	const [lightColor, setLightColor] = useState("#FFFFFF");
	const [darkColor, setDarkColor] = useState("#000000");
	const [versionMin, setVersionMin] = useState(10);
	const [versionMax, setVersionMax] = useState(10);
	const [mask, setMask] = useState(-1);
	const [boostEcc, setBoostEcc] = useState(true);
	const [statistics, setStatistics] = useState("");
	const [generatedImagerURL, setGeneratedImageURL] = useState("");
	const [area, setArea] = useState(1);
	const [parkingNumber, setParkingNumber] = useState(0);

	const canvasRef = useRef(null);
	const svgRef = useRef(null);
	const downloadRef = useRef(null);
	const imageWithNumberCanvasRef = useRef(null);

	useEffect(() => {
		redrawQrCode();
	}, [
		text,
		errorCorrectionLevel,
		outputFormat,
		border,
		scale,
		lightColor,
		darkColor,
		versionMin,
		versionMax,
		mask,
		boostEcc,
	]);

	const redrawQrCode = () => {
		const canvas = canvasRef.current;
		const svg = svgRef.current;
		const download = downloadRef.current;

		canvas.style.display = "none";
		svg.style.display = "none";

		const getInputErrorCorrectionLevel = () => {
			switch (errorCorrectionLevel) {
				case "medium":
					return qrcodegen.QrCode.Ecc.MEDIUM;
				case "quartile":
					return qrcodegen.QrCode.Ecc.QUARTILE;
				case "high":
					return qrcodegen.QrCode.Ecc.HIGH;
				default:
					return qrcodegen.QrCode.Ecc.LOW;
			}
		};

		const ecl = getInputErrorCorrectionLevel();
		const segs = qrcodegen.QrSegment.makeSegments(text);
		const qr = qrcodegen.QrCode.encodeSegments(
			segs,
			ecl,
			versionMin,
			versionMax,
			mask,
			boostEcc
		);

		if (border < 0 || border > 100) return;

		if (outputFormat === "bitmap") {
			if (scale <= 0 || scale > 30) return;
			drawCanvas(qr, scale, border, lightColor, darkColor, canvas);
			canvas.style.display = "none";
		} else {
			const code = toSvgString(qr, border, lightColor, darkColor);
			const viewBox = / viewBox="([^"]*)"/.exec(code)[1];
			const pathD = / d="([^"]*)"/.exec(code)[1];
			svg.setAttribute("viewBox", viewBox);
			svg.querySelector("path").setAttribute("d", pathD);
			svg.querySelector("rect").setAttribute("fill", lightColor);
			svg.querySelector("path").setAttribute("fill", darkColor);
			svg.style.display = "block";
			download.href =
				"data:application/svg+xml," + encodeURIComponent(code);
			download.download = "qr-code.svg";
		}

		setStatistics(
			`QR Code version = ${qr.version}, ` +
				`mask pattern = ${qr.mask}, ` +
				`character count = ${countUnicodeChars(text)},\n` +
				`encoding mode = ${describeSegments(segs)}, ` +
				`error correction = level ${"LMQH".charAt(
					qr.errorCorrectionLevel.ordinal
				)}, ` +
				`data bits = ${qrcodegen.QrSegment.getTotalBits(
					segs,
					qr.version
				)}.`
		);
		const url = canvas.toDataURL("image/png");
		setGeneratedImageURL(url);
	};

	const drawCanvas = (qr, scale, border, lightColor, darkColor, canvas) => {
		if (scale <= 0 || border < 0)
			throw new RangeError("Value out of range");
		const width = (qr.size + border * 2) * scale;
		canvas.width = width;
		canvas.height = width;
		let ctx = canvas.getContext("2d");
		for (let y = -border; y < qr.size + border; y++) {
			for (let x = -border; x < qr.size + border; x++) {
				ctx.fillStyle = qr.getModule(x, y) ? darkColor : lightColor;
				ctx.fillRect(
					(x + border) * scale,
					(y + border) * scale,
					scale,
					scale
				);
			}
		}
	};

	const toSvgString = (qr, border, lightColor, darkColor) => {
		if (border < 0) throw new RangeError("Border must be non-negative");
		let parts = [];
		for (let y = 0; y < qr.size; y++) {
			for (let x = 0; x < qr.size; x++) {
				if (qr.getModule(x, y))
					parts.push(`M${x + border},${y + border}h1v1h-1z`);
			}
		}
		return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${
			qr.size + border * 2
		} ${qr.size + border * 2}" stroke="none">
<rect width="100%" height="100%" fill="${lightColor}"/>
<path d="${parts.join(" ")}" fill="${darkColor}"/>
</svg>
`;
	};

	const describeSegments = (segs) => {
		if (segs.length === 0) return "none";
		else if (segs.length === 1) {
			const mode = segs[0].mode;
			const Mode = qrcodegen.QrSegment.Mode;
			if (mode === Mode.NUMERIC) return "numeric";
			if (mode === Mode.ALPHANUMERIC) return "alphanumeric";
			if (mode === Mode.BYTE) return "byte";
			if (mode === Mode.KANJI) return "kanji";
			return "unknown";
		} else return "multiple";
	};

	const countUnicodeChars = (str) => {
		let result = 0;
		for (const ch of str) {
			const cc = ch.codePointAt(0);
			if (0xd800 <= cc && cc < 0xe000)
				throw new RangeError("Invalid UTF-16 string");
			result++;
		}
		return result;
	};

	const handleVersionMinMax = (which, value) => {
		let minVal = which === "min" ? value : versionMin;
		let maxVal = which === "max" ? value : versionMax;
		minVal = Math.max(
			Math.min(minVal, qrcodegen.QrCode.MAX_VERSION),
			qrcodegen.QrCode.MIN_VERSION
		);
		maxVal = Math.max(
			Math.min(maxVal, qrcodegen.QrCode.MAX_VERSION),
			qrcodegen.QrCode.MIN_VERSION
		);
		if (which === "min" && minVal > maxVal) maxVal = minVal;
		else if (which === "max" && maxVal < minVal) minVal = maxVal;
		setVersionMin(minVal);
		setVersionMax(maxVal);
	};

	const checkParkingNumber = (e) => {
		if (e.target.value >= 0 && e.target.value < 100) {
			setParkingNumber(parseInt(e.target.value));
		} else {
			alert("value must be between 0 and 100");
		}
	};

	useEffect(() => {
		setText((prevText) => {
			const baseUrl = prevText.split("?")[0];

			const queryString = `?area=${area}&parking=${parkingNumber}`;

			return baseUrl + queryString;
		});
	}, [area, parkingNumber]);

	const handleDownload = () => {
		if (imageWithNumberCanvasRef.current) {
			const dataUrl = imageWithNumberCanvasRef.current.getCanvasDataUrl();
			if (dataUrl) {
				const link = document.createElement("a");
				link.href = dataUrl;
				link.download = "qr-code-with-number.png";
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	};

	return (
		<div
			id="container"
			style={{ display: "flex", justifyContent: "space-between" }}
		>
			<div id="controls">
				<h1>QR Code Generator</h1>
				<div>
					<label>
						Text string:
						<input
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder="Enter your text to be put into the QR Code"
						/>
					</label>
				</div>

				<div>
					<label>
						Parking Area:
						<select
							value={area}
							onChange={(e) => setArea(e.target.value)}
						>
							<option value={1}>Area 1</option>
							<option value={2}>Area 2</option>
							<option value={3}>Area 3</option>
							<option value={4}>Area 4</option>
							<option value={5}>Area 5</option>
							<option value={6}>Area 6</option>
						</select>
					</label>
				</div>
				<div>
					<label>
						Parking number:
						<input
							type="number"
							value={parkingNumber}
							onChange={(e) => checkParkingNumber(e)}
							min="0"
							max="99"
						/>
					</label>
				</div>

				{outputFormat === "bitmap" && (
					<div>
						<label>
							Scale:
							<input
								type="number"
								value={scale}
								onChange={(e) =>
									setScale(parseInt(e.target.value))
								}
								min="1"
								max="30"
							/>
							pixels per module
						</label>
					</div>
				)}
				<div>
					<label>
						Light color:
						<input
							type="color"
							value={lightColor}
							onChange={(e) => setLightColor(e.target.value)}
						/>
					</label>
					<label>
						Dark color:
						<input
							type="color"
							value={darkColor}
							onChange={(e) => setDarkColor(e.target.value)}
						/>
					</label>
				</div>

				<div></div>

				<div>
					<button onClick={handleDownload}>
						Download QR Code with Number
					</button>
				</div>

				<div>
					<strong>Statistics:</strong>
					<pre>{statistics}</pre>
				</div>
			</div>
			<div id="output">
				<canvas
					ref={canvasRef}
					style={{
						padding: "1em",
						backgroundColor: "#E8E8E8",
						display: "none",
					}}
				></canvas>
				<svg
					ref={svgRef}
					style={{
						width: "30em",
						height: "30em",
						padding: "1em",
						backgroundColor: "#E8E8E8",
					}}
				>
					<path d="" fill="#000000" strokeWidth="0"></path>
				</svg>

				<div>
					<ImageWithNumberCanvas
						ref={imageWithNumberCanvasRef}
						imageUrl={generatedImagerURL}
						number={area * 100 + parkingNumber}
						lightColor={lightColor}
						darkColor={darkColor}
					/>
				</div>
			</div>
		</div>
	);
};

export default QRCodeGenerator;
