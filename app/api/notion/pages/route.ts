import { NextResponse } from "next/server";
import { get_session } from "@/lib/session";
import { get_page_title, search_pages } from "@/lib/notion";

export const runtime = "nodejs";


export async function GET(){

	try{

		const session = await get_session();
		if(!session){
			return NextResponse.json(
				{ error: "A Notion connection is required" },
				{ status: 401}
			);
		}

		const pages_found = await search_pages();

		const pages = pages_found.map((page) =>({
			id: page.id,
			title: get_page_title(page),
			url: page.url,
			last_edited_time: page.last_edited_time
		}));

		return NextResponse.json({ pages });
	} catch{
		return NextResponse.json(
			{error: "Unable to retrieve Notion pages."},
			{status: 500}
		);
	}
}