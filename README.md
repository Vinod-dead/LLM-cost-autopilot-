# 🚀 LLM Cost Autopilot

> **Intelligent LLM cost optimization platform that analyzes prompts, intelligently routes requests, estimates inference costs, tracks token usage, and provides real-time analytics.**

---

## 📌 Overview

**LLM Cost Autopilot** is a full-stack AI engineering project designed to optimize the cost of Large Language Model (LLM) usage.

Instead of sending every request to the most powerful and expensive model, the system analyzes the complexity of the user's prompt and automatically selects an appropriate model tier.

The platform combines:

* 🤖 LLM integration
* 🧠 Intelligent prompt routing
* 💰 Cost estimation
* 📊 Usage analytics
* 🔢 Token tracking
* 🛡️ Error handling and fallback
* ⚡ React dashboard
* 🚀 FastAPI backend

The goal is to demonstrate how intelligent model selection can reduce unnecessary LLM inference costs while maintaining appropriate model capability.

---

# 🎯 Problem Statement

Modern AI applications frequently use powerful LLMs for every request.

However, not every task requires the same level of intelligence.

For example:

| User Request                                | Complexity | Suitable Model |
| ------------------------------------------- | ---------- | -------------- |
| What is Python?                             | Simple     | Cheap          |
| Explain machine learning                    | Moderate   | Balanced       |
| Design a distributed fraud detection system | Complex    | Powerful       |

If every request is sent to a powerful model, application costs can increase unnecessarily.

### 💡 Proposed Solution

LLM Cost Autopilot analyzes each prompt and automatically selects the most suitable model tier based on complexity.

```text
User Prompt
     │
     ▼
Prompt Analysis
     │
     ▼
Complexity Detection
     │
     ├──────────────┐
     │              │
   SIMPLE        MODERATE        COMPLEX
     │              │               │
     ▼              ▼               ▼
Cheap Model    Balanced Model   Powerful Model
     │              │               │
     └──────────────┼───────────────┘
                    ▼
              LLM Execution
                    │
                    ▼
             Token Tracking
                    │
                    ▼
             Cost Calculation
                    │
                    ▼
              Usage Analytics
```

---

# ✨ Key Features

## 🧠 Intelligent Model Routing

The routing engine analyzes the complexity of the prompt and selects an appropriate model tier.

### Model Tiers

| Tier        | Model            | Capability | Input / 1M Tokens | Output / 1M Tokens |
| ----------- | ---------------- | ---------- | ----------------: | -----------------: |
| 🟢 Cheap    | `cheap-model`    | ★★☆☆☆      |             $0.10 |              $0.40 |
| 🟡 Balanced | `balanced-model` | ★★★☆☆      |             $0.50 |              $1.50 |
| 🔴 Powerful | `powerful-model` | ★★★★★      |             $1.50 |              $4.00 |

---

# 💰 Cost Optimization

The system calculates the estimated inference cost using input and output token usage.

### Formula

```text
Input Cost =
(input tokens / 1,000,000) × input price

Output Cost =
(output tokens / 1,000,000) × output price

Total Cost =
Input Cost + Output Cost
```

### Example

For a moderate request:

```text
Selected Model Cost:   $0.001250
Powerful Model Cost:   $0.003500

Potential Savings:     $0.002250
Savings Percentage:    64.29%
```

This allows users to see how much cost could potentially be avoided by selecting a less expensive suitable model.

---

# 🤖 LLM Integration

The backend includes an LLM service responsible for communicating with the configured LLM provider.

The request flow is:

```text
Prompt
  ↓
Routing Engine
  ↓
Selected Model
  ↓
LLM Service
  ↓
LLM Provider
  ↓
Generated Response
  ↓
Token Usage
  ↓
Cost Calculation
```

The system attempts real LLM execution when the required API configuration is available.

If the external API is unavailable or the account has insufficient credits, the application uses a controlled fallback response instead of crashing the entire application.

---

# 🛡️ Error Handling & Fallback

The application handles common LLM integration failures such as:

* Missing API key
* API unavailable
* Insufficient API credits
* Invalid model configuration
* Unexpected provider errors

The fallback mechanism allows the routing and cost-optimization components to continue functioning even when the external LLM cannot generate a response.

Example fallback:

```text
OpenAI API is currently unavailable or has no credits.

The routing and cost optimization system is still working.
```

---

# 📊 Analytics Dashboard

The React dashboard provides real-time information about LLM usage.

### Dashboard Metrics

* Total Requests
* Total Cost
* Input Tokens
* Output Tokens
* Average Cost
* Selected Model
* Request Cost
* Potential Savings

Example:

```text
TOTAL REQUESTS
57

TOTAL COST
$0.170600

INPUT TOKENS
95,100

OUTPUT TOKENS
47,700

AVERAGE COST
$0.002993
```

---

# 📡 Request Telemetry

Each request can record usage information such as:

```json
{
  "id": 57,
  "model": "balanced-model",
  "provider": "demo",
  "input_tokens": 1000,
  "output_tokens": 500,
  "cost": 0.00125
}
```

This provides visibility into how the application is using LLM resources.

---

# 🏗️ System Architecture

```text
                  ┌─────────────────────────┐
                  │       React Frontend    │
                  │                         │
                  │      Dashboard UI       │
                  └────────────┬────────────┘
                               │
                               │ HTTP
                               ▼
                  ┌─────────────────────────┐
                  │       FastAPI API       │
                  │                         │
                  │      /generate          │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │    Routing Engine       │
                  │                         │
                  │ Complexity Analysis     │
                  │ Model Selection         │
                  └────────────┬────────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
        Cheap Model       Balanced Model    Powerful Model
             │                 │                 │
             └─────────────────┼─────────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │      LLM Service        │
                  │                         │
                  │    OpenAI Integration   │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │ Cost & Token Tracking   │
                  └────────────┬────────────┘
                               │
                               ▼
                  ┌─────────────────────────┐
                  │      Analytics          │
                  └─────────────────────────┘
```

---

# 🔄 Request Processing Flow

### 1️⃣ User Prompt

The user enters a natural-language request through the React dashboard.

### 2️⃣ Prompt Analysis

The backend analyzes the request and determines its complexity.

### 3️⃣ Model Selection

The routing engine selects:

```text
Simple     → cheap-model
Moderate   → balanced-model
Complex    → powerful-model
```

### 4️⃣ LLM Execution

The selected model is passed to the LLM service.

### 5️⃣ Token Tracking

Input and output token usage are captured when available.

### 6️⃣ Cost Calculation

The system calculates the estimated inference cost.

### 7️⃣ Analytics

The request information is reflected in the dashboard.

---

# 🖥️ Frontend

The frontend is built with **React and Vite**.

The dashboard includes:

* System status
* Cost metrics
* Token metrics
* Model routing
* Prompt analysis
* Routing results
* Cost optimization
* Generated output
* Request telemetry
* Model comparison
* Usage analytics

The interface is designed to provide a clear overview of the LLM routing and cost optimization process.

---

# ⚙️ Backend

The backend is built using **FastAPI**.

Responsibilities include:

* API request handling
* Prompt routing
* Model selection
* LLM integration
* Token tracking
* Cost calculation
* Usage analytics
* Error handling
* Fallback processing

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* JavaScript
* CSS

## Backend

* Python
* FastAPI
* Uvicorn
* Pydantic

## AI / LLM

* OpenAI SDK
* LLM model routing
* Token usage tracking
* Cost estimation

## Development

* Git
* GitHub
* Python virtual environment
* REST API
* Environment variables

---

# 📁 Project Structure

```text
LLM-cost-autopilot/
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   │
│   │   └── services/
│   │       ├── llm_service.py
│   │       └── router.py
│   │
│   ├── requirements.txt
│   └── .env
│
├── config/
│   └── models.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── index.html
│
├── .gitignore
└── README.md
```

---

# 🚀 Installation

## 1. Clone Repository

```bash
git clone https://github.com/Vinod-dead/LLM-cost-autopilot-.git
```

```bash
cd LLM-cost-autopilot-
```

---

# 🐍 Backend Setup

Create or activate the Python virtual environment.

### Windows

```powershell
.\backend\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r backend\requirements.txt
```

---

# 🔐 Environment Variables

Create:

```text
backend/.env
```

Add your API key:

```env
OPENAI_API_KEY=your_api_key_here
```

### ⚠️ Important

Never commit your API key to GitHub.

Make sure `.env` is included in `.gitignore`.

---

# ▶️ Run Backend

From the project root:

```powershell
python -m uvicorn backend.app.main:app --port 8001
```

Backend will run at:

```text
http://127.0.0.1:8001
```

FastAPI documentation:

```text
http://127.0.0.1:8001/docs
```

---

# ⚛️ Frontend Setup

Open a second terminal:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Open the URL provided by Vite, usually:

```text
http://localhost:5173
```

---

# 🔌 API

## Generate

```text
POST /generate
```

The endpoint accepts a user prompt and returns routing, LLM, cost, and usage information.

Example request:

```json
{
  "prompt": "Explain machine learning in simple terms"
}
```

Example routing result:

```json
{
  "complexity": "moderate",
  "selected_model": "balanced-model",
  "estimated_cost": 0.00125,
  "savings_percentage": 64.29
}
```

---

# 🧪 Example

### Input

```text
Explain machine learning in simple terms
```

### Routing

```text
Complexity:
MODERATE

Selected Model:
balanced-model
```

### Cost

```text
Selected:
$0.001250

Powerful:
$0.003500

Potential Savings:
$0.002250

Savings:
64.29%
```

This demonstrates the core functionality of the project.

---

# 📈 Current Project Status

## Completed

* [x] React dashboard
* [x] FastAPI backend
* [x] Prompt analysis
* [x] Complexity detection
* [x] Intelligent model routing
* [x] Model configuration
* [x] Cost calculation
* [x] Savings calculation
* [x] Token tracking
* [x] LLM service
* [x] OpenAI SDK integration
* [x] Error handling
* [x] Fallback response
* [x] Usage analytics
* [x] Model comparison
* [x] FastAPI documentation
* [x] Frontend production build
* [x] GitHub repository

## Pending

* [ ] Production deployment
* [ ] Portfolio screenshots
* [ ] Authentication/access control
* [ ] Additional LLM providers
* [ ] Advanced monitoring

---

# 🔮 Future Improvements

Potential future improvements include:

### Multi-Provider Support

Add additional LLM providers and compare their cost and performance.

### Advanced Routing

Use more sophisticated prompt classification and model evaluation.

### Performance Monitoring

Track latency, errors, and model performance.

### Authentication

Add user authentication and API authorization.

### Production Deployment

Deploy the frontend and backend as production services.

### Advanced Analytics

Add historical cost trends, model usage charts, and optimization reports.

---

# 🔒 Security

Sensitive credentials should always be stored using environment variables.

Never expose:

```text
OPENAI_API_KEY
API tokens
Passwords
Private credentials
```

Never commit:

```text
.env
```

to the public repository.

---

# 🎓 What This Project Demonstrates

This project demonstrates practical experience in:

### Artificial Intelligence

* LLM applications
* Prompt analysis
* Model routing
* LLM API integration

### Machine Learning Engineering

* Intelligent decision systems
* Model selection
* Cost optimization
* Usage monitoring

### Backend Engineering

* FastAPI
* REST APIs
* API error handling
* Service-based architecture

### Frontend Engineering

* React
* Vite
* Dashboard design
* API integration

### Software Engineering

* Git
* GitHub
* Environment configuration
* Modular project structure

---

# 📸 Screenshots

Add screenshots of your actual application here.

### Dashboard

```text
Add your dashboard screenshot here.
```

### Routing Result

```text
Add a screenshot showing:
Prompt → Complexity → Selected Model → Cost → Savings
```

### Analytics

```text
Add a screenshot showing:
Total Requests → Total Cost → Input Tokens → Output Tokens
```

---

# 🏆 Portfolio Highlight

**LLM Cost Autopilot** demonstrates how intelligent model routing can be used to reduce unnecessary LLM inference costs.

The project combines:

```text
React
   +
FastAPI
   +
LLM Integration
   +
Intelligent Routing
   +
Cost Optimization
   +
Token Tracking
   +
Analytics
```

into a single full-stack AI engineering application.

---

# 👨‍💻 Author

## Vinod Reddy

Aspiring **AI & Machine Learning Engineer** interested in:

* Artificial Intelligence
* Machine Learning
* Deep Learning
* Large Language Models
* Data Science
* MLOps
* AI Application Development

---

# ⭐ If You Like This Project

If this project helped you understand LLM routing and cost optimization, consider giving the repository a ⭐.

---

## 📌 Project Summary

> **LLM Cost Autopilot is a full-stack AI platform that analyzes prompt complexity, automatically selects an appropriate LLM model tier, estimates inference cost, calculates potential savings, tracks token usage, and presents the results through an interactive React dashboard.**
