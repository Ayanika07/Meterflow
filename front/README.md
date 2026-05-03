⚡ MeterFlow – Usage-Based API Billing Platform
A full-stack SaaS platform that allows developers to register APIs, generate access keys, track usage through a gateway, apply rate limiting, and calculate billing based on usage. Inspired by real-world systems like Stripe Billing, RapidAPI, and AWS API Gateway.

🌐 Live Demo

Frontend: https://meterflow.netlify.app
Backend: https://meterflow-2.onrender.com
GitHub: https://github.com/Ayanika07/Meterflow


🧠 What It Does

User signs up and logs in
Registers an external API with a base URL
Generates a unique API key (mk_...)
End users hit the gateway with the API key
Gateway validates the key, applies rate limiting, logs the request, and forwards it to the actual API
Usage is tracked and billing is calculated monthly


🔥 Core Features

JWT Authentication — Secure signup/login with bcrypt password hashing
API Management — Register APIs, generate and revoke access keys
API Gateway — Intercepts all requests, validates keys, and forwards to target APIs
Usage Logging — Every request logged with endpoint, method, status, and latency
Rate Limiting — 10 requests per minute per API key
Billing Engine — First 1000 requests free, ₹0.5 per 100 requests after
Dashboard — Real-time charts showing request latency, success rate, and recent logs


🧱 Tech Stack
Frontend

React + Vite
React Router DOM
Axios
Recharts

Backend

Node.js + Express
MongoDB + Mongoose
JWT (jsonwebtoken)
bcryptjs
node-fetch
cors

Infrastructure

Frontend → Netlify
Backend → Render
Database → MongoDB Atlas


📁 Project Structure
Meterflow/
├── back/
│   └── src/
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── apiController.js
│       │   ├── apiKeyController.js
│       │   ├── gatewayController.js
│       │   ├── logController.js
│       │   └── billingController.js
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   ├── gatewayMiddleware.js
│       │   └── rateLimiter.js
│       ├── models/
│       │   ├── User.js
│       │   ├── API.js
│       │   ├── APIkey.js
│       │   ├── UsageLog.js
│       │   └── Billing.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── apiRoutes.js
│       │   ├── apikeyTRoutes.js
│       │   ├── gatewayRoutes.js
│       │   ├── logRoutes.js
│       │   └── billingRoutes.js
│       └── app.js
└── front/
    └── src/
        ├── api/
        │   └── axios.js
        ├── components/
        │   ├── Navbar.jsx
        │   └── PrivateRoute.jsx
        └── pages/
            ├── Login.jsx
            ├── Signup.jsx
            ├── Dashboard.jsx
            ├── ApiKeys.jsx
            └── Billing.jsx

🗄️ Database Schema
Users
FieldTypeemailStringpasswordString (hashed)
APIs
FieldTypeuserIdObjectIdnameStringbaseUrlStringisActiveBoolean
API Keys
FieldTypeuserIdObjectIdapiIdObjectIdkeyStringstatusactive / revoked
Usage Logs
FieldTypeapiKeyIdObjectIduserIdObjectIdapiIdObjectIdendpointStringmethodStringstatusNumberlatencyNumber (ms)
Billing
FieldTypeuserIdObjectIdapiIdObjectIdtotalRequestsNumberfreeLimitNumber (1000)billableRequestsNumbertotalAmountNumberstatusunpaid / paid

🚀 API Endpoints
Auth
MethodEndpointDescriptionPOST/auth/signupRegister new userPOST/auth/loginLogin and get JWT token
APIs
MethodEndpointDescriptionPOST/apisRegister new APIGET/apisGet all user's APIsDELETE/apis/:idDelete an API
API Keys
MethodEndpointDescriptionPOST/apikey/generateGenerate new API keyGET/apikeyGet all user's keysPATCH/apikey/revoke/:idRevoke a key
Gateway
MethodEndpointDescriptionALL/gateway/*Forward request to target API
Logs
MethodEndpointDescriptionGET/logsGet all logsGET/logs/summaryGet usage summaryGET/logs/:apiIdGet logs for specific API
Billing
MethodEndpointDescriptionGET/billingGet all billsGET/billing/summaryGet billing summaryPOST/billing/generate/:apiIdGenerate bill for APIPATCH/billing/pay/:billIdMark bill as paid

⚙️ Local Setup
Prerequisites

Node.js v18+
MongoDB (local or Atlas)

Backend Setup
bashcd back
npm install
Create .env file:
PORT=5000
MONGO_URI=mongodb://localhost:27017/meterflow
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret
Run backend:
bashnpm run dev
Frontend Setup
bashcd front
npm install
npm run dev
Open http://localhost:5173

💡 How the Gateway Works
User Request + API Key
        ↓
Rate Limiter (10 req/min)
        ↓
Key Validation (active?)
        ↓
Request Logger (async)
        ↓
Forward to Target API
        ↓
Return Response

💼 Resume Description

Built a scalable API gateway system to track and meter API usage. Implemented rate limiting, API key authentication, and request logging. Designed a billing engine for usage-based pricing. Developed a real-time analytics dashboard using React and Recharts. Deployed on Render and Netlify with MongoDB Atlas.