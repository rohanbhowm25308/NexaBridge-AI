# NexaBridge AI — Secure Enterprise AI Integration Hub

**Nexever AI Integration Internship · Task 02**

A Flask-based, interactive enterprise integration **demonstration** with five synthetic connectors (email, drive, ticketing, CRM, chat), role-based record access, a local question-answer assistant, SQLite audit events, and a basic sensitive-pattern scanner.

## Quick start (Windows)

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Edit `.env` and replace all four placeholders with strong values. Then run:

```powershell
python app.py
```

Open `http://127.0.0.1:5000` and log in as employee, manager, or admin with the corresponding password from `.env`.

## What works

- Login/logout and server-side session role checks.
- Five local sample connectors and per-record classification checks.
- Local deterministic question-answering over permitted synthetic data; no LLM API or outbound model request.
- Server-side denial for unauthorized connector and audit access.
- SQLite audit trail of key actions and authorization decisions.
- Basic input pattern blocking and redaction test panel.
- Responsive dark dashboard and interactive architecture diagram.

## Important limitations

**This is a prototype, not a production-secure enterprise connector platform.** It does not connect to Gmail, Google Drive, Jira, Salesforce, or Slack. It does not implement real OAuth/SSO, provider ACLs, token vault, enterprise DLP, human approvals, production SIEM, or external AI model inference. Demo password authentication is for local use only. The local DLP regex is incomplete and must not be relied on to protect real secrets. Do not upload or paste real confidential company data.

For deployment: use HTTPS, COOKIE_SECURE=1, a durable secret, a production WSGI server, managed storage, robust authentication, rate limits, central audit logging, secure secrets management, and a formal security review. Do not deploy the demo as an internet-accessible system without these protections.

## Suggested validation

1. Employee can view internal Email records but cannot access CRM.
2. Manager can access confidential CRM records but not restricted records.
3. Admin can inspect audit events; Employee cannot.
4. Enter `api_key=demo123` in the scanner and verify a blocked/redacted result.
5. Ask the assistant to summarize a connector; verify that restricted sample records are absent.

## Architecture

User → Flask session + CSRF gate → role/record policy → local assistant / synthetic connectors → authorized records. Each operation logs a structured event in SQLite.

See `ARCHITECTURE.md` for the formal integration design and production roadmap.


### Demo login (local only)
A `.env` file is included with Employee / `Employee@2026`, Manager / `Manager@2026`, and Administrator / `Admin@2026`. Change these before sharing or deploying. Never commit `.env` to Git.

### Animated background
The site streams the reference video from the supplied CloudFront URL; internet access and an available URL are required. If it is unavailable, the original animated dotted background remains visible.


## Open self-registration (updated)
Anyone can register a unique username and password (8+ characters), then sign in. Passwords are hashed in SQLite and are **not** stored in `.env`. All self-registered accounts receive the **Employee** role, not Admin or Manager. To create a local admin for audit log demonstrations, uncomment and configure `DEMO_ADMIN_USERNAME` and `DEMO_ADMIN_PASSWORD` in `.env` before starting the app for the first time. Do not use demo secrets in production.

If you already ran an earlier version, you can retain the existing `nexabridge.db`; the `users` table is added automatically. Restart Flask after extracting. This is a local internship demo, not production-ready public authentication (add rate limiting, email verification, HTTPS, account recovery and SSO before deployment).


## Cyber Circuit background
The background uses `static/circuit.js` and HTML Canvas. It is animated locally and does not require CloudFront or an MP4. Reduced-motion preferences are respected.


## Email-based registration (updated)
New users register and sign in using an email address and password (8–128 characters).
No username is needed. Existing SQLite databases are automatically migrated to add an email column; legacy username-only accounts can still sign in with their old username.
If you want a fresh database, stop Flask and delete `nexabridge.db` (this also deletes all demo accounts and audit history).
The app remains a local demo, not a production-ready identity provider. Email ownership is not verified; deploy only after adding verification, throttling, HTTPS and account recovery.


## Groq and private document uploads
Install dependencies, set `GROQ_API_KEY` in `.env`, and restart Flask. Go to Integrations to upload TXT/MD/CSV/JSON/PDF/DOCX/XLSX files (5 MB limit), then AI Assistant > My uploaded files, check desired documents, and ask a question. Files are stored as extracted text in the local SQLite database and are visible only to their uploading account. Selected text is transmitted to Groq; do not upload confidential, regulated, or sensitive company data. The DLP regex is only a demonstration and cannot guarantee removal of all secrets. No live provider connectors are configured.


## Dynamic CSV Dashboard
Upload a CSV from Integrations. After upload, the Overview displays real CSV record counts, columns, missing cells, column profiles, up to three frequency charts, and a searchable preview of the first 100 rows. Use the dataset dropdown to switch between your CSV files. Click **Analyze selected CSV with Groq** to open the assistant with the dataset selected. This does not change the five simulated connectors.

**Important:** The distributed ZIP intentionally excludes the original SQLite database and real `.env` secrets. Create an account again on a fresh installation, or copy your existing `nexabridge.db` and private `.env` from your old installation to retain your accounts and Groq configuration. Never commit these files to GitHub. The built-in scanner is a demonstration and is not production-grade DLP.


## New feature labs
- **AI Data Guardian:** `/api/guardian/<file_id>` locally scans an owned upload and previews redaction. It does **not** automatically sanitize content sent by the AI Assistant; use only safe demonstration data.
- **AI Workflow Studio:** `/api/workflows/run` simulates role-authorized actions and records per-user history. No live provider writes.
- **AI Insight Forge:** `/api/insights/<file_id>` computes descriptive CSV findings; the Groq button opens the existing permission-aware assistant with the selected file.
- Architecture navigation was removed, but `ARCHITECTURE.md` is retained.


### Voice input and footer
The AI Assistant includes optional browser speech-to-text. Click **Voice**, speak, review the recognized text in the question field, then click **Ask**. This uses the browser SpeechRecognition API and may rely on the browser vendor’s speech service; audio is not uploaded to this Flask application. Browser microphone permissions and speech recognition support are required. The footer includes the developer’s public social links.
