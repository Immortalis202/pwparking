import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";

const ImageWithNumberCanvas = forwardRef(({ imageUrl, number, lightColor, darkColor }, ref) => {
	const canvasRef = useRef(null);


	useImperativeHandle(ref, () => ({
		getCanvasDataUrl: () => {
			if(canvasRef.current) {
				return canvasRef.current.toDataURL("image/png");
			}
			return null;
		}
	}));

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		const img = new Image();
		img.onload = () => {
			
			// Set canvas size to match the image
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the image on the canvas
            ctx.drawImage(img, 0, 0);

            // Set up text style
            ctx.font = "bold 48px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            // Calculate text metrics
            const textMetrics = ctx.measureText(number.toString());
            const textWidth = textMetrics.width;
            const textHeight = 48; // Approximate height based on font size

            // Draw white square behind the number
            const padding = 10;
            const squareSize = Math.max(textWidth, textHeight) + padding * 2;
            const x = canvas.width / 2;
            const y = canvas.height / 2;

			ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            
            ctx.fillStyle = lightColor;
			
            ctx.fillRect(
                x - squareSize / 2,
                y - squareSize / 2,
                squareSize,
                squareSize
            );
			

            // Draw the number
            ctx.fillStyle = "white";
            ctx.strokeStyle = darkColor;
            ctx.lineWidth = 2;
            ctx.strokeText(number.toString(), x, y);
            ctx.fillText(number.toString(), x, y);
			
		};
		img.src = imageUrl;
	}, [imageUrl, number, lightColor,darkColor]);

	return <canvas ref={canvasRef} />;
});

export default ImageWithNumberCanvas;
