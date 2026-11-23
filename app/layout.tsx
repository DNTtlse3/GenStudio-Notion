import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";

export const metadata : Metadata = {
	title : "GenStudio",
	description : "Consulter et exporter vos pages Notion."
}

export default function RootLayout({ children } : {children : ReactNode}){

	return (
		<html lang="fr">
			<body>
				{children}
			</body>
		</html>
	);
}