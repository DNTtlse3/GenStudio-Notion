import { NextResponse } from "next/server";
import { app_url, get_env } from "@/lib/environment";
import { gen_new_state } from "@/lib/crypto";


export const runtime = "nodejs";


export async function GET(){

	const genStudio_state = gen_new_state();

	const url = new URL(get_env("NOTION_AUTH_URL"));
	url.searchParams.set("client_id", get_env("NOTION_CLIENT_ID"));
	url.searchParams.set("redirect_uri", get_env("NOTION_REDIRECT_URI"));
	url.searchParams.set("response_type", "code");
	url.searchParams.set("owner", "user");
	url.searchParams.set("state", genStudio_state);

	const connect_response = NextResponse.redirect(url);

	/*
		Pour secure on s'en passe de get_env, puisque en mode développement
		on est pas forcement obliger de ajouter NODE_ENV sur .env.local . 
		Ce qui nous évite d'avoir à géner l'exception qui sera levé par get_env
	*/

	connect_response.cookies.set(
		"notion_oauth_state", 
		genStudio_state, 
		{
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 600
		}
	);

	return connect_response;
}