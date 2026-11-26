/*Doc : https://github.com/WiseLibs/better-sqlite3/blob/HEAD/docs/api.md*/


import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { 
	type Stored_Tokens, 
	type Query_Format 
} from "@/lib/utils";

/*=======================================================================================*/

const DEFAULT_DB_PATH = "./.data/app-data.sqlite";


/*Apporter une mise-à-jour ici, lors du build il y'a warning*/
const DB_PATH = resolve( process.env.DATABASE_PATH ?? DEFAULT_DB_PATH);

mkdirSync( dirname(DB_PATH) , { recursive : true } );

/*=======================================================================================*/

/**/
const genStudioNotion_database = new Database(DB_PATH);

genStudioNotion_database.pragma("journal_mode = WAL");
genStudioNotion_database.pragma("foreign_keys = ON" );



genStudioNotion_database.exec(
`
	CREATE TABLE IF NOT EXISTS sessions (
		id_hash TEXT PRIMARY KEY,
		encrypted_tokens TEXT NOT NULL,
		workspace_name TEXT,
		expires_at INTEGER NOT NULL,
		created_at INTEGER NOT NULL
	);
`
);

/*=======================================================================================*/

/**/
export function insert_session(id_hash: string, encrypted_tokens: string, tokens: Stored_Tokens){

	const start = Date.now();

	genStudioNotion_database.prepare(
	`
		INSERT INTO sessions (
			id_hash,
			encrypted_tokens,
			workspace_name,
			expires_at,
			created_at )

		VALUES (
			@id_hash,
			@encrypted_tokens,
			@workspace_name,
			@expires_at,
			@created_at )

		ON CONFLICT (id_hash) DO UPDATE SET
			encrypted_tokens = excluded.encrypted_tokens,
			workspace_name = excluded.workspace_name,
			expires_at = excluded.expires_at
	`
	).run({
		id_hash,
		encrypted_tokens,
		workspace_name: tokens.workspace_name ?? null,
		expires_at: start + 30 * 24 * 60 * 60 * 1000,
		created_at: start
	});
}

/*=======================================================================================*/

/**/
export function select_session(id_hash : string){

	const result = genStudioNotion_database.prepare(
		"SELECT * FROM sessions WHERE id_hash = ? AND expires_at > ?"
	).get(id_hash, Date.now());

	return result as Query_Format | undefined;
}

/*=======================================================================================*/

/**/
export function delete_session(id_hash : string){

	genStudioNotion_database.prepare(
		"DELETE FROM sessions WHERE id_hash = ?"
	).run(id_hash);

}


/*=======================================================================================*/