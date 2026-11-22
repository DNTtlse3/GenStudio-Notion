import { get_session } from "@/lib/session";
import { notion_api, type Notion_Page } from "@/lib/utils";
import { get_env } from "@/lib/environment";


function rich_text_to_string(input : unknown) : string {
	if(!Array.isArray(input)){
		return "";
	}

	return input.map((item : any) => item?.plain_text ?? "").join("");
}


export function get_page_title(page : Notion_Page) : string {

	const properties = page.properties ?? {};

	for(const property of Object.values(properties) as any[]){
		if(property?.type === "title" && Array.isArray(property.title)){
			return rich_text_to_string(property.title) || "Untitled page";
		}
	}

	return page.title || "Untitled page";
}


export async function search_pages(): Promise<Notion_Page[]>{

	const data = await notion_fetch<{results : Notion_Page[]}>(
		"/search", {
			method : "POST",
			body: JSON.stringify({
				filter:{ property: "object", value: "page"},
				page_size: 100,
				sort: {direction: "descending", timestamp: "last_edited_time"}
			})
		});

	return data.results ?? []; 
}


export async function notion_fetch<T>(path : string, init : RequestInit = {}) : Promise<T> {
	
	const session = await get_session();
	if(!session){
		throw new Error("");
	}

	try {

		const notion_api_version = get_env("NOTION_API_VERSION");

		const response = await fetch(`${notion_api}${path}`, {
			...init,
			headers: {
				Authorization: `Bearer ${session.access_token}`,
				"Notion-Version": notion_api_version,
				"Content-Type": "application/json",
				...init.headers
			},
			cache: "no-store"
		});

		if(!response.ok){
			throw new Error(`notion_api_ERROR_${response.status}`);
		}


		return response.json() as Promise<T>;

	} catch (error) {
		
		throw new Error(error.message);
	}
}