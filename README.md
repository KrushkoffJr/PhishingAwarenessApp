🎯 Phishing Awareness Training App

📖 About
A full-stack web application designed to train employees in recognizing phishing attacks through interactive quizzes. The platform features gamification elements including badges, leaderboards, and progress tracking to encourage ongoing security awareness.

🎮 Key Features

Interactive Quiz System - Multiple-choice questions with immediate feedback
Gamification - Badge system and leaderboards to motivate learning

🦈 Baby Shark (50 points)
🥷 Spam Samurai (100 points)
🛡️ Unphishable (200 points)
🐟 Phish Fingers (10 wrong answers)

Progress Tracking - Monitor learning advancement and scores
Admin Panel - Manage questions, users, and view analytics
Secure Authentication - JWT-based auth with HTTP-only cookies
Responsive Design - Works on desktop and mobile devices

🏗️ Architecture
Tech Stack
Frontend:

React 18 (Vite)
React Router for navigation
Fetch API for HTTP requests

Backend:

Node.js with Express
PostgreSQL database
JWT authentication
bcrypt password hashing

Security:

Parameterized SQL queries (SQL injection protection)
HTTP-only cookies (XSS protection)
SameSite cookies (CSRF protection)
bcrypt password hashing with salt

Database Schema
Users
├── user_id (PK)
├── username
├── email
├── password_hash
├── score
├── role (USER/ADMIN)
└── created_at

Questions
├── question_id (PK)
├── question_text
├── option_a
├── option_b
├── option_c
├── correct_option
└── created_at

Answers
├── answer_id (PK)
├── user_id (FK)
├── question_id (FK)
├── chosen_option
├── is_correct
└── answered_at

Badges
├── badge_id (PK)
├── user_id (FK)
├── badge_name
└── awarded_at

📷 App Screenshots:

![Login-Page](https://github.com/user-attachments/assets/457f72df-154b-4c68-b4b0-726f87d73fc3)

![Home-Page](https://github.com/user-attachments/assets/187575a7-366a-42ef-bcb6-6412903d485f)

![Quiz-Page](https://github.com/user-attachments/assets/44d7e0ec-1607-41f3-b6c4-b57a18007de2)

![leaderboard-Page](https://github.com/user-attachments/assets/45bdb7d5-1a48-4780-8f6c-2a529cae24ad)

![Badges-Page](https://github.com/user-attachments/assets/9ded0271-7dc5-4eab-b24e-473b94f76fdf)

![Admin Panel](https://github.com/user-attachments/assets/1a530b84-4a63-440b-aa9a-980d60ba3aa6)


🚀 Getting Started
Prerequisites

Node.js 18+
Docker & Docker Compose
Git

Installation

Clone the repository

bash git clone https://github.com/yourusername/phishing-awareness-app.git
cd phishing-awareness-app

Start the PostgreSQL database

bash docker compose up -d

Initialize the database

bash docker exec -i $(docker ps -qf "ancestor=postgres:15") psql -U appuser -d phishingapp < backend/init.sql
Alternative (if above fails):
bash # Via psql
psql -U appuser -d phishingapp -h localhost -f backend/init.sql

# Or via pgAdmin

# Import init.sql through pgAdmin GUI

Install and start the backend

bash cd backend
npm install
npm run dev
Backend runs on: http://localhost:5000

Install and start the frontend

bash cd frontend
npm install
npm run dev
Frontend runs on: http://localhost:5173

Open the app
Navigate to http://localhost:5173 in your browser

🔑 Demo Credentials
Regular User:

Username: demo
Password: demo

Admin User:

Username: admin
Password: admin

📁 Project Structure
phishing-awareness-app/
├── backend/
│ ├── server.js # Express server setup
│ ├── routes/ # API routes
│ ├── middleware/ # Auth middleware
│ ├── db.js # PostgreSQL connection
│ ├── init.sql # Database schema & seed data
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── components/ # React components
│ │ ├── pages/ # Page components
│ │ ├── App.jsx # Main app component
│ │ └── main.jsx # Entry point
│ ├── index.html
│ └── package.json
├── docker-compose.yml # PostgreSQL container config
└── README.md

🔒 Security Features
Authentication & Authorization

JWT tokens stored in HTTP-only cookies
Role-based access control (USER/ADMIN)
Password hashing with bcrypt (10 rounds + salt)

Attack Prevention

SQL Injection: Parameterized queries with pg library ($1, $2, ...)
XSS: HTTP-only cookies prevent JavaScript access to tokens
CSRF: SameSite cookie attribute

Data Protection

Passwords never stored in plain text
JWT tokens expire after 1 hour
GDPR considerations implemented (Art. 6 Abs. 1 lit. f - legitimate interest)

🎓 Development Process
This project was developed using Agile methodology:

Iterative development in sprints
MVP first (basic quiz functionality)
Feature additions (badges, admin panel)
Continuous improvements based on feedback

Testing Approach

Manual E2E testing
Cross-browser compatibility testing
Security testing (SQL injection, XSS attempts)

🚧 Future Improvements

Automated testing (Jest, Cypress)
HTTPS/SSL implementation
Email verification
Password reset functionality
Multi-factor authentication (MFA)
Advanced analytics dashboard
Question categories and difficulty levels
Timed quiz mode
Export user data (GDPR compliance)
Multilingual support

📝 API Documentation
Public Endpoints
POST /api/login # User login
POST /api/register # User registration
POST /api/logout # User logout
Protected Endpoints (Requires Auth)
GET /api/questions # Get random question
POST /api/answers # Submit answer
GET /api/profile # Get user profile
GET /api/leaderboard # Get top users
GET /api/badges # Get user badges
Admin Endpoints (Requires Admin Role)
GET /api/admin/users # Get all users
POST /api/admin/questions # Create question
PUT /api/admin/questions/:id # Update question
DELETE /api/admin/questions/:id # Delete question

🤝 Contributing
This is a learning project, but feedback and suggestions are welcome!

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author
Ivaylo Krushkov
FIAE Trainee at AncudIT, Nürnberg

GitHub: @KrushkoffJr
LinkedIn: [Ivaylo Krushkov](https://www.linkedin.com/in/ivaylo-krushkov-0089512b4/)
Email: krushkoff@outlook.com

🙏 Acknowledgments

AncudIT for the training opportunity
IHK for the FIAE certification program
The Node.js, React, and PostgreSQL communities

📊 Project Stats

Development Time: 1.5 months
Lines of Code: ~2,000,
Database Tables: 4,
API Endpoints: 15+,
Security Measures: 5+ implemented...

Built with ❤️ as part of my FIAE certification journey
