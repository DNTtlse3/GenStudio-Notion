import type { Metadata } from "next";
import "./globals.css";

export const metadata : Metadata = {
	title : "GenStudio-Notion",
	description : "Consulter et exporter vos pages Notion."
}

export default function RootLayout({ children }){

	return (
		<html lang="fr">
			<body>
				{children}
			</body>
		</html>
	);
}