import { get_env } from "./lib/environment";


export function allowed_origin(req : Request) : boolean {

	var approbation : boolean = false;

	const current_origin  = req.headers.get("origin");

	try{
		
		const real_origin_app = get_env("APP_URL");

		if(!(current_origin && real_origin_app)){
			return approbation;
		}

		try{
			approbation = (URL(current_origin).origin == new URL(real_origin_app).origin);
		} catch {
			approbation = false;
		}

		return approbation;

	} catch(error) {

		throw new Error(error.message);
	}
}