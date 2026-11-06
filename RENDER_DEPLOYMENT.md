# Deploy NexaBridge AI to Render

1. Push the contents of this `NexaBridge_AI` folder to the **root** of a GitHub repository. Do not commit `.env`, database files, or API keys.
2. Render Dashboard → New → Blueprint → connect the repository → apply `render.yaml`.
3. Set the secret `GROQ_API_KEY` in the Render environment. The model can be changed using `GROQ_MODEL` to one available on your Groq account.
4. After deployment, open the provided Render URL. HTTPS is provided by Render.

Manual Web Service settings: Python; Build Command `pip install -r requirements.txt`; Start Command `gunicorn app:app --bind 0.0.0.0:$PORT --workers 1 --threads 4 --timeout 120`. Set `SECRET_KEY` to a long random secret, `COOKIE_SECURE=1`, and `GROQ_API_KEY` privately.

**Important storage warning:** The included SQLite database is stored on Render's ephemeral filesystem. Free instance restarts/redeploys can erase accounts, uploads and audit history. For persistent use, provision a Render persistent disk on a compatible paid plan and set `DATABASE_PATH=/var/data/nexabridge.db`, or migrate to a hosted database. Do not treat this demo as a production identity or sensitive-data system: there is no email verification, login throttling or account recovery. The five enterprise connectors are simulated. Browser voice input requires a supported browser and microphone permission.
