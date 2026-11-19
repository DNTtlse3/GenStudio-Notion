
/*Pour le test on charge explicetement la variable d'environment locale*/
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local"
});


export function get_env(name : string){
  const env : string = process.env[name];
  if(!env){
    throw new Error(`{env :: ${name}} don't exists !`);
  }
  return env;
}


export function app_url() : string {
  return get_env("APP_URL").replace(/\/$/,"");
}