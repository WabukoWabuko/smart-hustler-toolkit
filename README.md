# Smart Hustler Toolkit

Yo, welcome to the **Smart Hustler Toolkit**—a mobile-first expense and invoice manager built for Kenyan freelancers and small business owners. It parses M-Pesa SMS, tracks expenses, generates invoices, and preps tax reports. Built with 💪 Django, React, Bootstrap, and SQLite3.

## Why This Exists
- Solves real problems: M-Pesa transaction tracking, invoicing, and KRA tax compliance.
- Shows off full-stack skills: backend APIs, frontend UI, and mobile-first design.
- Portfolio gold: unique, practical, and locally relevant.

## Setup Instructions
1. **Backend (Django)**:
   ```bash
   python -m venv env
   source env/bin/activate  # On Windows: env\Scripts\activate
   pip install -r requirements.txt
   cd backend
   python manage.py migrate
   python manage.py runserver
   ```
2. **Frontend (React)**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173` and see the magic.

## Tech Stack
- **Backend**: Django, Django REST Framework, SQLite3
- **Frontend**: React (Vite), Bootstrap, Axios
- **DevOps**: Git, GitHub (more to come)

## Next Steps
- Phase 2: Build the M-Pesa SMS parsing engine.
- Stay tuned for more guru-level features!

---
Built with 🔥 by a coder who gets it.