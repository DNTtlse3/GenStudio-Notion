# GenStudio-Notion

Ce projet est une application Next.Js permettant de faire une intégration Notion via OAuth 2.0, avec un stockage sécurisé des jetons, des sessions gérées par l'application et des appels direct à l'API REST de Notion.


## Technologies
- Frontend : Next.Js, React, TypeScript
- Backend : Next.js, TypeScript
- Données : better-sqlite3
- Auth : Notion OAuth 2.0


## Prérequis
- Node.Js 18 ou version ultérieure
- pnpm
- Intégration de Notion avec des identifiants OAuth

## Structure du Projet
```text
GenStudio-Notion
|--- app/          Page,Layout et routes API Next.Js             
|--- lib/          Services(Chiffrement, Session, ..)
|--- tests/        Tests Vitest
|--- public/	   Ressources
|--- package.json  Scprits du workspace
|--- README.md             
```
## Pour commencer

### 1. Cloner le répertoire
```bash
git clone <repo-url>
cd GenStudio-Notion
```
### 2. Installations des dépendances
```bash
pnpm install
```

### 3. Configuration des variables d'environment

Créer un fichier de variables d'environement dans `GenStudio-Notion/.env.local`

```env

APP_URL=http://localhost:3000

NOTION_CLIENT_ID=remplacer_par_le_client_id
NOTION_CLIENT_SECRET=remplacer_par_le_client_secret
NOTION_REDIRECT_URI=http://localhost:3000/api/auth/notion/callback
NOTION_AUTH_URL=https://api.notion.com/v1/oauth/authorize
NOTION_API_VERSION=2026-03-11

ENCRYPTION_KEY=remplacer_par_une_cle_base64_de_32_octets


DATABASE_PATH=./.data/app-data.sqlite

NODE_ENV=development
```

Généner une clé de chiffrement de jeton à l'aide de :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Assurez-vous que l'URI de redirection de votre intégration Notion corresponde exactement à:

```text
http://localhost:3000/api/auth/notion/callback
```


### 4. Lancer l'application
```bash
pnpm dev
```
L'application s'exécute à l'adresse `http://localhost:3000`

## Scripts disponibles
|Script|Description|
|---------|---------|
|`pnpm dev`|Développer l'application Next.Js|
|`pnpm build`|Construire la version production|
|`pnpm start`|Lancer la version production|
|`pnpm test`|Exécuter les test en mode surveillance|
|`pnpm test:run`|Exécuter les tests une seule fois|
|`pnpm typecheck`|Vérifier les types TypeScript|


## Présentation de l'API

Voici les Frontend requests

|Endpoint|Méthode|Description
|---------|---------|---------|
|`/api/auth/notion/connect`|`GET`|Créer une URL d'authorisation OAuth.|
|`/api/auth/notion/callback`|`GET`|Échanger un code OAuth contre des jetons.|
|`/api/notion/status`|`GET`|Vérifier l'état de la connexion de l'utilisateur actuel.|
|`/api/auth/notion/disconnect`|`POST`|Supprimer la connexion Notion enregistrée.|
|`/api/notion/page`|`GET`|Récupérer la liste des pages Notion auxquelles l'utilisateur a accordé l'accés lors de l'autorisation OAuth.|



