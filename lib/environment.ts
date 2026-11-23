import dotenv from "dotenv";


/*
  Pour les test avec vitest, puisque les varialbes d'environment
  qui sont dans env.local ne sont pas chargés automatiquement.
*/
dotenv.config({
  path: ".env.local"
});

/*=======================================================================================*/

export function get_env(name : string){
  const env = process.env[name];
  if(!env){
    throw new Error(`{env :: ${name}} don't exists !`);
  }
  return env;
}

/*=======================================================================================*/

export function app_url() : string {
  return get_env("APP_URL").replace(/\/$/,"");
}

/*=======================================================================================*/