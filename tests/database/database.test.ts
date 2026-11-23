import { describe, it, expect } from "vitest";
import { insert_session, select_session, delete_session } from "../../lib/database";
import { type Stored_Tokens, type Query_Format } from "../../lib/utils";
import { gen_session_id, gen_hash_session_id, gen_new_state } from "../../lib/crypto";


const session_id = gen_session_id();
const id_hash = gen_hash_session_id(session_id);

const tokens : Stored_Tokens = {
	access_token : "",
	refresh_token : "",
	expires_at: Date.now() + 30 * 24 * 60 * 60 * 1000,
	workspace_name : "Test"
}

const encrypted_tokens = gen_new_state();

insert_session(id_hash, encrypted_tokens, tokens);

describe("select_session", () => {
	it("Found", () => {

		const response = select_session(id_hash);
		expect(response !== undefined ).toBe(true);
	});

});


