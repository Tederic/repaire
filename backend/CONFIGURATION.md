Configuration Discord OAuth

Créer un fichier .env dans le dossier backend avec :

DISCORD_CLIENT_ID=ton_client_id
DISCORD_CLIENT_SECRET=ton_client_secret
DISCORD_REDIRECT_URI=http://localhost:4000/auth/discord/callback
FRONTEND_URL=http://localhost:5173

Pour l’accès admin via Discord :
DISCORD_GUILD_ID=ton_server_id
DISCORD_BOT_TOKEN=ton_bot_token
DISCORD_ADMIN_ROLE_ID=role_id
DISCORD_ADMIN_ROLE_NAME=Modérateur

Ensuite relancer le backend :
- npm run dev
