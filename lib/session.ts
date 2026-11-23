"use server";

import { cookies } from "next/headers";
import { get_env } from "@/lib/environment";
import { decrypt, encrypt, gen_hash_session_id } from "@/lib/crypto";
import { select_session, insert_session } from "@/lib/database";

import { 
	type Refresh_Properties, 
	type Stored_Tokens, 
	SESSION_COOKIE,
	notion_api_refresh 
} from "@/lib/utils";


/*=======================================================================================*/
/**/
export async function get_session(){

	const cookie_store = await cookies();
	const session_id   = cookie_store.get(SESSION_COOKIE)?.value;

	if(!session_id){
		return null;
	}

	const query_session= select_session(gen_hash_session_id(session_id));

	if(!query_session){
		return null;
	}

	const tokens = JSON.parse(decrypt(query_session.encrypted_tokens)) as Stored_Tokens;

	/*
		Si le token_access de la session à expirer, alors on appel Notion pour demander un 
		renouvellement.
	*/
	if(tokens.expires_at - Date.now() < 60000) {
		const refreshed = await refreshed_notion_tokens(tokens.refresh_token);
		const update : Stored_Tokens = {
			...tokens,
			access_token: refreshed.access_token,
			refresh_token: refreshed.refresh_token,
			expires_at: Date.now() + (refreshed.expires_in ?? 3600) * 1000
		};


		insert_session(gen_hash_session_id(session_id), encrypt(JSON.stringify(update)), update);

		return {
			...update,
			workspace_name: query_session.workspace_name
		};
	}

	return {
		...tokens,
		workspace_name: query_session.workspace_name
	};
}

/*=======================================================================================*/

async function refreshed_notion_tokens(refresh_token: string){

	try {

		const client_id     = get_env("NOTION_CLIENT_ID");
		const client_secret = get_env("NOTION_CLIENT_SECRET");

		if(!(client_id && client_secret)){
			throw new Error("OAuth configuration missing.");
		}

		const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
		const response = await fetch(notion_api_refresh, {
			method : "POST",
			headers: {
				Authorization: `Basic ${basic}`,
				"Content-Type": "application/json",
				Accept: "application/json"
			},
			body: JSON.stringify({
				grant_type: "refresh_token",
				refresh_token: refresh_token
			}),
			cache: "no-store"
		});

		const data = await response.json();

		if(!response.ok){
			throw new Error("Unable to renew the Notion connection.");
		}

		return data as Refresh_Properties;

	} catch(error) {

		if(error instanceof Error){
			throw new Error(error.message);
		}else{
			throw new Error("fct[refreshed_notion_tokens] => [Unknown error]");
		}
	}

}

/*=======================================================================================*/