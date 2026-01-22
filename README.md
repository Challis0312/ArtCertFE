# Overview
 
This frontend is built with **React 18 + Vite** for fast HMR and lean production builds, uses **Amazon Cognito** with **PKCE** for standards-based authentication without exposing secrets, calls a REST **API via Axios** (configurable through `VITE_API_BASE_URL`), and navigates with **React Router**. State is managed with lightweight **React Hooks/Context** to avoid unnecessary complexity, tests run on **Vitest + React Testing Library** for fast feedback and coverage, and configuration is injected via `VITE_` environment variables (`.env`) to cleanly separate dev/staging/prod. Requires **Node.js ≥ 18**.


# To run the project
First Run  
```
npm install
```

Then create a ".env" file project root directory with the required contents

After installation and creation of ".env" file, to run servers run:
```
npm run dev
```

To run all test cases:
```
npm run test
```

To run test cases w coverage:
```
npm run coverage
```