
export const notion_api = "https://api.notion.com/v1";
export const notion_api_refresh = "https://api.notion.com/v1/oauth/token";
export const SESSION_COOKIE = "notion_studio_session";


export type Refresh_Properties = { 
	access_token: string; 
    refresh_token: string; 
    expires_in?: number; 
};



export type Notion_Page = {
	id: string;
	url?: string;
	last_edited_time?: string;
	properties?: Record<string, unknown>;
	title?: string;
};



export type Notion_Block = {
	id: string;
	type: string;
	has_children?: boolean;
	[key : string]: unknown;
};


export type Query_Format = {
	id_hash: string;
	encrypted_tokens: string;
	workspace_name: string | null;
	expires_at: number;
};


export type Stored_Tokens = {
	access_token: string;
	refresh_token: string;
	expires_at: number;
	workspace_name?: string;
};
