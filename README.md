# Agentlyou

**Agentlyou** is a presence as a service platform that allows clients to hire agents to show up anywhere on their behalf. Whether it's running an errand, attending an appointment, sitting in on an interview, representing you at an event or handling any in-person task, Agentlyou makes it easy to find and hire a trusted proxy.

> **Status**: In development

## Tech Stack

- **Frontend:** React, Typescript, Tailwind CSS
- **Backend:** Django, Django REST Framework

## Installation

### Prerequisites

- Python 3.10+
- Node.js 18+

### 1. Clone the repository

```bash
git clone https://github.com/Karenmiano/AGENTLYOU.git
cd AGENTLYOU
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a .env file in the backend directory and add the following variables:

```
ENV=development
SECRET_KEY=your_secret_key
```

Run migrations and start the development server:

```bash
python manage.py migrate
python manage.py runserver
```

Docs available at: `http://127.0.0.1:8000/api/schema/redoc/`

### 3. Set up the frontend

```bash
cd frontend
npm install
```

Run the development server:

```bash
npm run dev
```

### Flows you can try:

- /signup/role
- /signup/form
- /gigs/new/title
