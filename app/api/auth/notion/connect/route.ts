"use server";


import { NextResponse } from "next/server";
import { app_url, get_env } from "@/lib/environment";
import { gen_new_state } from "@/lib/crypto";


export async function GET(){

	/*On génére un état pour la demande d'intégration de Notion*/
	const genStudio_state = gen_new_state();

	/*Définition des paramètres nécessaires pour une demande d'intégration Notion*/
	const url = new URL(get_env("NOTION_AUTH_URL"));
	url.searchParams.set("client_id", get_env("NOTION_CLIENT_ID"));
	url.searchParams.set("redirect_uri", get_env("NOTION_REDIRECT_URI"));
	url.searchParams.set("response_type", "code");
	url.searchParams.set("owner", "user");
	url.searchParams.set("state", genStudio_state);

	/*On appel Notion pour la demande de connection*/
	const connect_response = NextResponse.redirect(url);

	/*
		On définit notion_oauth_state pour pouvoir récupérer genStudio_state,
		dans la route callback/route.ts.
	*/
	connect_response.cookies.set(
		"notion_oauth_state", 
		genStudio_state, 
		{
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 10 /*10 minuites*/
		}
	);

	return connect_response;
}