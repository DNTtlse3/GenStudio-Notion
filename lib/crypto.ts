import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { get_env } from "./lib/environment";

/*
	Pour le test on charge explicetement la variable d'environment locale
*/
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local"
});


function gen_randomBytes(length : number){
	if(length >= 0){
		return randomBytes(length);
	}else{
		return randomBytes(0);
	}
}


function env_openssl_key() : Buffer {
	try{
		const env_key = Buffer.from(get_env("ENCRYPTION_KEY"),"base64");

		if(env_key.length !== 32){
			throw new Error("length(ENCRYPTION_KEY) must be equal to 32 bytes");
		}

		return env_key;

	} catch(error){

		throw new Error(error.message);
	}
}


export function encrypt(input: string) : string {

	const init_vect = gen_randomBytes(12);
	const cipher    = createCipheriv("aes-256-gcm", env_openssl_key(), init_vect);
	const result    = Buffer.concat([cipher.update(input, "utf8"), cipher.final()]);
	const ref       = cipher.getAuthTag()

	return [init_vect, ref, result].map((value) => value.toString("base64")).join(".");
}



export function decrypt(input: string) : string {

	const [init_vect, ref, data] = input.split(".");

	if(!(init_vect && ref && data)){
		throw new Error("Invalid encrypted data");
	}

	const decipher = createDecipheriv("aes-256-gcm", env_openssl_key(), Buffer.from(init_vect,"base64"));
	decipher.setAuthTag(Buffer.from(ref,"base64"));

	return Buffer.concat([decipher.update(data,"base64"), decipher.final()]).toString("utf8");
}


export function gen_session_id(): string{
	return gen_randomBytes(32).toString("base64");
}


export function gen_hash_session_id(session_id: String): string {
	return createHash("sha256").update(session_id).digest("hex");
}


export function gen_new_state(): string {
	return gen_randomBytes(32).toString("base64url");
}