"use server";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { delete_session } from "@/lib/database";
import { gen_hash_session_id } from "@/lib/crypto";
import { allowed_origin } from "@/lib/security";
import { SESSION_COOKIE } from "@/lib/utils";


export async function POST(request : NextRequest){

	/*
		On s'assure que la demande de vouloir déconnecter Notion provient
		de l'application qui tourne sur APP_URL définie dans .env.local . 
	*/
	if(!allowed_origin(request)){
		return NextResponse.json(
			{ error: "Origin refused."},
			{ status: 403}
		);
	}

	/*On récupére l'ID de la session définie avec SESSION_COOKIE*/
	const cookie_store = await cookies();
	const session_id = cookie_store.get(SESSION_COOKIE)?.value;
	

	/*Suppression de l'ID de session de la base de données*/
	if(session_id){
		delete_session(gen_hash_session_id(session_id));
	}

	const disconnect_response = NextResponse.json({ success: true });

	disconnect_response.cookies.delete(SESSION_COOKIE);

	return disconnect_response;
}