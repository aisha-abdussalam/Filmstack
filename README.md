FILMSTACK

FilmStack is a high-performance, full-stack movie management system designed to move beyond volatile client-side storage toward a robust, production-ready architecture. The application features a custom-built RESTful API that facilitates secure user authentication, persistent data management, and an optimized discovery interface. By integrating a relational database with modern backend logic, the project demonstrates a complete transition from local state to a scalable, cloud-deployed environment.

Core Features:

*Persistent Data Management: Utilizes PostgreSQL and Prisma ORM to handle complex relational data, replacing localStorage with a persistent server-side state.

*Professional Authentication: Implements a secure JWT-based authentication flow using HttpOnly cookies to protect against XSS and CSRF vulnerabilities.

*Advanced Querying: Supports multi-criteria filtering, title-based search, and automated pagination for seamless data retrieval.

*Data Integrity: Employs Zod for strict schema validation and soft-delete logic to maintain historical data while updating the user interface.

*Optimized Media: Leverages Cloudinary for efficient image storage and high-speed delivery of movie assets.

🛠 Technical Stack

Layer            Technology

Frontend        Vanilla JavaScript, CSS3, HTML5

Backend          Node.js, Express.js

Database        PostgreSQL, Prisma ORM

Security        JSON Web Tokens (JWT), Bcrypt, Zod

Deployment      Vercel (Frontend), Render (Backend)

Deployment & Infrastructure

The application is architected for cross-platform stability, utilizing a multi-cloud deployment strategy. The frontend is hosted on Vercel, communicating with a Render-hosted backend through a strictly configured CORS policy. Environment-specific variables and secure proxy settings ensure that the production handshake remains stable and secure, even across different hosting domains.

📷 Live Demo

Frontend: https://filmstack.vercel.app/

Backend API: https://filmstack.onrender.com

Getting Started

Clone the repository:

git clone https://github.com/your-username/filmstack.git

Install dependencies:

cd backend && npm install

cd ../frontend && npm install

Environment Setup: Create a .env file in the backend directory and configure your DATABASE_URL, JWT_SECRET, and Cloudinary credentials.

Database Migration:

npx prisma generate

npx prisma db push

Run the application:

npm start

Future Roadmap

*Responsive Optimization: Implementation of mobile-first design patterns to ensure cross-device compatibility.

*Personalization: Development of a "Favorites" module to allow users to persist custom movie collections to their profiles.

*Social Integration: Ability for users to share curated lists via external platforms.

👩‍💻 Author

Aisha Abdussalam

GitHub: https://github.com/aisha-abdussalam

LinkedIn: https://www.linkedin.com/in/aisha-abdussalam-333623210
