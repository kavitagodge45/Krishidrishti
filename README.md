🌱 KrishiDrishti (कृषिदृष्टी)

AI-Powered Smart Agriculture Assistant for Maharashtra

KrishiDrishti is an intelligent agriculture web platform designed to help farmers access agricultural information, explore mandi market prices, plan farming activities, and receive AI-powered agricultural guidance through a simple, multilingual interface.

The project focuses on Maharashtra in its initial phase, with the goal of making useful agricultural information more accessible to farmers.

📌 Problem Statement

Farmers often face challenges accessing reliable agricultural information, checking market prices, understanding weather conditions, planning crops, and identifying crop-related problems. Information is scattered across multiple sources, and language barriers can make digital agricultural services difficult to use.

There is a need for a unified, accessible platform that helps farmers find relevant agricultural information and make informed farming decisions.

💡 Proposed Solution

KrishiDrishti brings essential agricultural tools and information together in one web application. It aims to simplify agricultural decision-making through an AI-based agricultural assistant, mandi market price information, farm-planning support, and multilingual access.

The platform is being developed with a focus on Maharashtra farmers and reliable, data-driven agricultural services.

✨ Key Features

- AI Agricultural Assistant: Provides agricultural guidance through an AI-powered interface.
- Mandi Market Prices: Designed to help farmers access agricultural commodity prices.
- Weather Information: Supports farming decisions with weather-related information.
- Crop Doctor: Provides crop-related guidance and disease assistance where the required service is available.
- Farm Planning: Helps users organize agricultural activities.
- Farmer Dashboard: Provides a centralized interface for farmer-related information and tools.
- Multilingual Interface: Supports English, Hindi, and Marathi.
- Responsive Design: Designed for convenient access across supported screen sizes.

Feature availability depends on the implementation and configuration of the deployed version. External API-powered features require valid configuration and a working data source.

🛠️ Tech Stack

Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React

Backend

- Node.js
- Express.js
- TypeScript

Database and Authentication

- Supabase
- PostgreSQL
- Supabase Authentication
- Row-Level Security (RLS), where configured

APIs and Integrations

- Government agricultural data sources, such as data.gov.in, where configured
- AI service integration, where configured
- Weather data integration, where configured

Deployment and Development

- Git and GitHub
- Render
- Vercel for frontend deployment, if configured
- Visual Studio Code

🏗️ System Architecture

Farmer / User
      |
      v
React + TypeScript Frontend
      |
      v
Backend API (Node.js + Express)
      |
      +------> Supabase / PostgreSQL
      |
      +------> AI Service (if configured)
      |
      +------> Agricultural Data APIs
      |
      +------> Weather API (if configured)

The actual request flow depends on the project's current configuration. Some Supabase operations may be performed directly from the frontend using the Supabase client and appropriate security policies.

🚀 Getting Started

Prerequisites

Install the following software:

- Node.js (compatible with the project version)
- npm
- Git
- Visual Studio Code

1. Clone the Repository

git clone https://github.com/kavitagodge45/Krishidrishti.git
cd Krishidrishti

2. Install Dependencies

Inspect the repository structure first.

If the project uses a root "package.json":

npm install

If the frontend and backend have separate package files, install dependencies in their respective directories:

cd client
npm install

Repeat for the backend directory if it contains its own "package.json".

3. Configure Environment Variables

Create the appropriate ".env" files based on the variable names referenced in your source code.

Example frontend configuration:

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key

Example backend configuration:

SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_server_side_secret_key

These are examples, not a guarantee that the repository uses these exact variable names. Check the existing configuration and use the names expected by your code.

Security: Never commit real API keys, database passwords, service-role keys, or other secrets to GitHub. Keep ".env" files out of version control and configure production secrets through the deployment provider.

4. Start the Development Server

Run the command specified by the relevant "package.json" scripts.

A typical Vite frontend uses:

npm run dev

A typical backend may use:

npm run dev

The exact commands and ports depend on the repository configuration.

5. Build for Production

For a Vite frontend, the typical build command is:

npm run build

Resolve any build errors before deploying.

🌐 Deployment

KrishiDrishti is deployed using Render for the configured service.

Live website: "https://krishidrishti-dwzz.onrender.com" (https://krishidrishti-dwzz.onrender.com)

Before deployment, verify:

1. Build and start commands match the repository.
2. Required environment variables are configured.
3. Supabase URL and public client key are correct.
4. Database tables, permissions, and RLS policies are configured.
5. External API keys are valid and available to the appropriate service.
6. Production logs do not contain unresolved errors.

🔐 Security and Data Reliability

KrishiDrishti aims to use reliable data sources and avoid presenting simulated information as real agricultural data.

- Keep secret keys on the server.
- Apply appropriate database access policies.
- Validate user input and API responses.
- Handle unavailable APIs and errors clearly.
- Do not display fabricated market prices, weather observations, or crop diagnoses as real data.
- Clearly communicate when a data source is unavailable.

🎯 Target Users

- Farmers in Maharashtra
- Users seeking accessible agricultural information
- Farmers who prefer Marathi or Hindi interfaces
- Agricultural communities interested in digital farming assistance

🔮 Future Scope

- Improve real-time agricultural data integrations.
- Expand crop-specific and regional agricultural guidance.
- Enhance AI-based crop disease assistance.
- Add more agricultural languages and accessibility options.
- Introduce additional farmer-focused services based on verified needs.

👩‍💻 Project Team

Team Name: skill Sculptors
Project: KrishiDrishti (कृषिदृष्टी)
Team Leader: Kavita Godge
Institute: Maharashtra Institute of Technology, Aurangabad

🤝 Contributions

Contributions, suggestions, and feedback are welcome. Fork the repository, create a feature branch, and submit a pull request describing your changes.

📄 License

A license has not yet been specified. Add a suitable open-source license if you intend to permit reuse and redistribution.

---

KrishiDrishti — Empowering farmers with accessible agricultural information and intelligent digital tools.
