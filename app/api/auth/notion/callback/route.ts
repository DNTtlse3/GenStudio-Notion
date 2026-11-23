"use server";

import { NextRequest, NextResponse } from "next/server";
import { app_url, get_env } from "@/lib/environment";
import { encrypt, gen_hash_session_id, gen_session_id } from "@/lib/crypto";
import { insert_session } from "@/lib/database";
import { type Stored_Tokens, SESSION_COOKIE } from "@/lib/utils";




export async function GET(request : NextRequest){

	/*Récupération des paramètres obligatoires pour l'opération d'échange*/
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const state_retrieve = url.searchParams.get("state");
	const state_save = request.cookies.get("notion_oauth_state")?.value;
	const oauth_error = url.searchParams.get("error");


	/*Option de secours si jamais */
	const process_fail = (msg_fail: string) => {

		const home = new URL("/", app_url());
		home.searchParams.set("auth_error", msg_fail);

		const home_response = NextResponse.redirect(home);
		home_response.cookies.delete("notion_oauth_state");

		return home_response;

	};

	/*
		On s'assure que la rederiection faite par Notion 
	*/
	if(oauth_error){
		return process_fail("authorization_cancelled");
	}



	if(!code || !state_retrieve || !state_save || state_retrieve !== state_save){
		return process_fail("invalid_oauth_state");
	}

	try{

		const client_id = get_env("NOTION_CLIENT_ID");
		const client_secret = get_env("NOTION_CLIENT_SECRET");
		const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

		/*
			On appel Notion pour obtenir notre access_token et un refresh_token qui servira pour 
			le rafraîchissement de l'access_token, lorsque ce dernier expirera.
		*/
		const token_response = await fetch(
			"https://api.notion.com/v1/oauth/token",
			{
				method: "POST",
				headers: {
					Authorization: `Basic ${basic}`,
					"Content-Type": "application/json",
					Accept: "application/json"
				},
				body: JSON.stringify(
					{
						grant_type : "authorization_code",
						code, /*code envoyer par Notion*/
						redirect_uri: get_env("NOTION_REDIRECT_URI")
					}

				),
				cache: "no-store"
			}
		);

		const token_data = await token_response.json();

		if(!token_response.ok || !token_data.access_token || !token_data.refresh_token){
			return process_fail("token_exchange_failed");
		}

		/*On attribue un ID de session pour l'access_token obtenu*/
		const session_id = gen_session_id();

		const tokens : Stored_Tokens = {
			access_token: token_data.access_token,
			refresh_token: token_data.refresh_token,
			expires_at: Date.now() + (token_data.expires_in ?? 3600) * 1000, /*Durée de vie de notre access_token*/
			workspace_name: token_data.workspace_name ?? "Notion Space" 
		};

		/*
			On enregistre l'ID de la session et le champs tokens dans la base de 
			l'application.
		*/
		insert_session(
			gen_hash_session_id(session_id), 
			encrypt(JSON.stringify(tokens)),
			tokens
		);

		const response = NextResponse.redirect(new URL("/", app_url()));
		response.cookies.set(
			SESSION_COOKIE, 
			session_id,
			{
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
				maxAge: 60 * 60 * 24 * 30
			}
		);


		response.cookies.delete("notion_oauth_state");

		return response;

	} catch {

		return process_fail("oauth_server_error");
	}
}

