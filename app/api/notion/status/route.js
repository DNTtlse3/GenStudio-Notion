"use server";

import { NextResponse } from "next/server";
import { get_session } from "@/lib/session";

export async function GET(){
	
	try{
		
		const genStudio_session = await get_session();

		return NextResponse.json({
			connected: Boolean(genStudio_session),
			workspace_name: genStudio_session?.workspace_name ?? null
		});

	} catch {

		return NextResponse.json({
			connected: false,
			workspace_name: null
		});
	}
}