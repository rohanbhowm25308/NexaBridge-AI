# 🌐 NexaBridge AI
### Bridging Enterprise Systems with the Power of Artificial Intelligence

**Built with Innovation, Powered by AI, Engineered for Secure Intelligence.**

<p align="center">
  <img src="https://img.shields.io/badge/AI-Groq%20Powered-00D4FF?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-Python%20%7C%20Flask-3776AB?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-F7DF1E?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Deployment-Render-46E3B7?style=for-the-badge" />
</p>

<p align="center">
  <a href="https://nexabridge-ai.onrender.com">
    <img src="https://img.shields.io/badge/🚀_LIVE_DEMO-Explore_NexaBridge_AI-00D4FF?style=for-the-badge" alt="Live Demo" />
  </a>
  <a href="https://github.com/rohanbhowm25308/NexaBridge-AI">
    <img src="https://img.shields.io/badge/⭐_GITHUB-Source_Code-181717?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
</p>

---

## 🚀 The Vision

**What if enterprise intelligence could exist in one connected workspace?**

Modern organizations depend on emails, cloud storage, customer platforms, ticketing systems, and collaboration tools. But fragmented information creates unnecessary complexity.

**NexaBridge AI** is an AI-powered enterprise integration demonstration designed to bring data intelligence, controlled information access, workflow simulation, and conversational AI together in a unified environment.

Developed during my **AI Integration Internship at Nexever**, this project explores how intelligent applications can combine automation, usability, and security-aware architecture.

> **One Intelligent Bridge. Five Enterprise Connections. A Smarter Way to Work.**

---

## 🌍 Live Application

### 🚀 Experience NexaBridge AI

**Live Website:** https://nexabridge-ai.onrender.com

**GitHub Repository:** https://github.com/rohanbhowm25308/NexaBridge-AI

Explore the platform by creating an account, uploading sample datasets, interacting with the AI Assistant, and testing the simulated enterprise workflows.

---

## ✨ Core Features

###  01 — Enterprise AI Assistant
- Groq-powered conversational AI.
- Ask general questions and analyze selected documents.
- Context-aware responses using authorized demonstration data.
- Interactive, responsive chat interface.

###  02 — Voice-Powered AI Interaction
- Microphone-enabled question input.
- Automatic speech-to-text transcription.
- Edit recognized text before submitting.
- Browser-based voice recognition support.

###  03 — Enterprise Integration Hub

Explore five enterprise connector simulations:

| Integration | Function |
|---|---|
|  Email | Communication data exploration |
|  Drive | Document and file access |
|  Ticketing | Support workflow exploration |
|  CRM | Customer record demonstrations |
|  Chat | Collaboration data exploration |

These connectors use synthetic demonstration records rather than live external company accounts.

###  04 — Dynamic Analytics Dashboard
- Upload CSV datasets.
- Automatically update dashboard statistics.
- Explore rows, columns, and missing values.
- Generate visual insights.
- Preview and search dataset records.

###  05 — AI Data Guardian
- Inspect uploaded document content.
- Detect common sensitive-information patterns.
- Generate redacted previews.
- Promote awareness of privacy risks before AI processing.

###  06 — AI Workflow Studio
- Run simulated enterprise workflows.
- Explore automation stages.
- Review workflow execution history.
- Understand how business processes can be orchestrated.

###  07 — AI Insight Forge
- Analyze CSV data quality.
- Discover useful dataset patterns.
- Generate local analytical findings.
- Request optional Groq-powered recommendations.

###  08 — Security & Audit Center
- Session-based user authentication.
- Role-based access demonstrations.
- CSRF protection.
- Access restrictions for simulated records.
- Audit logging.
- Sensitive-text scanning.

---

##  System Architecture

```text
                    ┌──────────────────────┐
                    │     NEXABRIDGE AI    │
                    │    Enterprise Hub    │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │    Frontend Layer    │
                    │   HTML · CSS · JS    │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │    Flask Backend     │
                    │ Authentication & API │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
      ┌──────▼──────┐   ┌──────▼──────┐   ┌──────▼──────┐
      │  Groq AI    │   │ Data Engine │   │  Security   │
      │ Assistant   │   │ CSV & Files │   │  Policies   │
      └─────────────┘   └─────────────┘   └─────────────┘
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                    ┌──────────▼───────────┐
                    │ Enterprise Demo Hub  │
                    │ Email · Drive · CRM  │
                    │ Tickets · Team Chat  │
                    └──────────────────────┘
```

---

##  Technology Stack

| Category | Technologies |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Python, Flask |
| AI Integration | Groq API |
| Database | SQLite |
| Data Analytics | Python, CSV processing |
| Voice Recognition | Web Speech API |
| Deployment | Render, Gunicorn |
| Version Control | Git, GitHub |

---

##  User Experience

NexaBridge AI features a futuristic, enterprise-inspired interface with:

- Dark navy and electric-blue styling.
- Animated circuit-line background.
- Interactive navigation and smooth section transitions.
- Responsive dashboard cards.
- Dynamic file-upload summaries.
- Accessible voice input controls.

The design combines a modern AI aesthetic with practical data exploration.

---

##  Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rohanbhowm25308/NexaBridge-AI.git
cd NexaBridge-AI
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
```

Windows:

```powershell
venv\Scripts\activate
```

macOS/Linux:

```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file using `.env.example` as a reference.

```env
GROQ_API_KEY=your_groq_api_key
SECRET_KEY=your_secure_random_secret
```

Set any additional variables required by your deployment.

**Never commit API keys or secret credentials to GitHub.**

### 5. Start the Application

```bash
python app.py
```

Open the local address shown in the terminal, typically:

`http://127.0.0.1:5000`

---

##  Deployment

NexaBridge AI is deployed using **Render**.

**Live Deployment:**

https://nexabridge-ai.onrender.com

Render build command:

```bash
pip install -r requirements.txt
```

Render start command:

```bash
gunicorn app:app --bind 0.0.0.0:$PORT
```

Configure `GROQ_API_KEY` and `SECRET_KEY` in Render's environment settings.

**Storage note:** Local SQLite databases and uploaded files may be lost on hosting instances without persistent storage.

---

##  Responsible AI & Data Privacy

NexaBridge AI is an educational and internship demonstration.

- Enterprise connectors operate on synthetic records.
- The AI Assistant can send selected uploaded content to Groq.
- Sensitive-pattern detection is not a guarantee of complete privacy protection.
- Data Guardian previews do not automatically enforce redaction in AI requests.
- Real confidential, regulated, or company-sensitive information should not be uploaded.
- Production use would require stronger authentication, persistent storage, and additional security controls.

---

##  Internship Experience

**Company:** Nexever  
**Internship Role:** AI Integration  
**Project:** NexaBridge AI  
**Assignment:** Internship Task 02

Through this project, I explored practical concepts involving:

- AI integration with full-stack web applications.
- Enterprise-style connector architecture.
- API-driven intelligent assistance.
- Data processing and visualization.
- Security-aware workflow design.
- Cloud application deployment.

NexaBridge AI represents an effort to transform theoretical AI integration concepts into an interactive working demonstration.

---

## 👨‍💻 Developer

### Rohan Bhowmik

**AI/ML | Data Science | Generative AI | AI Agents | Web Development**

Passionate about developing intelligent systems that solve real-world problems through machine learning, automation, and modern web technologies.

<p align="center">
  <a href="https://github.com/rohanbhowm25308">
    <img src="https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white" />
  </a>
  <a href="https://www.linkedin.com/in/rohan-bhowmik-b014473a1">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" />
  </a>
  <a href="https://www.instagram.com/rohan_._.bhowmik.84/">
    <img src="https://img.shields.io/badge/Instagram-Follow-E4405F?style=for-the-badge&logo=instagram&logoColor=white" />
  </a>
</p>

---

## ⭐ Support the Project

If NexaBridge AI inspires you or helps you explore enterprise AI integration, consider giving this repository a **⭐ Star**.

Contributions, feedback, and suggestions are welcome.

---

<p align="center">
  <b>🌐 NEXABRIDGE AI</b>
</p>

<p align="center">
  <i>Built with Innovation, Powered by AI, Engineered for Secure Intelligence.</i>
</p>

<p align="center">
  <b>Developed by Rohan Bhowmik</b>
</p>
