
# Auth0 Demo App – Test & Feature Documentation

## 📋 Demo Perimeter

This document describes the scope, test accounts, and reusable details for the Auth0 Demo App, which includes multiple Auth0 features and flows.


### 1. Purpose
- Demonstrate and test multiple Auth0 features in a single app
- Includes: Custom Token Exchange, SSO, Adaptive MFA, Organizations, Log Streams, and more
- Visualize and decode tokens for learning and troubleshooting


### 2. Features Covered
- Custom Token Exchange (CTE)
- SAML IdP-Initiated SSO
- Adaptive MFA
- Organizations
- Log Streams
- Token generation and decoding
- User profile and session management


### 3. Test Accounts & Credentials

- **SAML IdP-Initiated SSO (Demo/Test User):**
	- **Email:** `test123@gmail.com`
	- **Password:** `Password1234`
	- Use these credentials when testing the SAML IdP-initiated flow (see the SAML IdP-Initiated page in the app or docs for details).

- **Other Flows (Okta, Passwordless, Social, etc.):**
	- Use your own accounts for Okta, email/password, passwordless, or social login flows. The app does not provide test users for these; you must use your own credentials for each provider. For flows like Adaptive MFA, you will need to enroll the required MFA factor (e.g., authenticator app, SMS, etc.) during your first login if not already enrolled.



### 4. Environment Variables
```
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://my-api.example.com
AUTH0_CLIENT_SECRET=your-client-secret-here
```


### 5. Demo Steps (Example)
1. Enter user details (email, name)
2. Generate an external/legacy token (CTE flow)
3. Exchange the token via backend (CTE flow)
4. Test SSO, Adaptive MFA, Organizations, etc. via sidebar navigation
5. View Auth0 tokens and decoded payloads


### 6. Documentation Overview

Below is a summary of each documentation file included in this project and its purpose:

- **AUTH0_SETUP_GUIDE.md** – Step-by-step guide for configuring Auth0, including enabling Custom Token Exchange and setting up your Auth0 tenant and applications.
- **CLOUDFLARE_DEPLOYMENT.md** – Instructions for deploying the demo app and backend to Cloudflare Pages and Workers, including environment setup and secrets management.
- **CUSTOM_TOKEN_EXCHANGE_GUIDE.md** – Deep-dive technical guide on implementing Auth0's Custom Token Exchange (CTE) feature, including architecture, flows, and backend integration.
- **IDP_INITIATED_SSO_README.md** – Explains how the app supports SAML/OIDC IdP-initiated SSO, the differences from SP-initiated SSO, and how tokens are handled in the React SPA.
- **IMPLEMENTATION_SUMMARY.md** – High-level summary of what was built in the demo, including key files, features, and next steps for running or extending the project.
- **QUICK_START.md** – Fast setup guide for getting the demo running, with concise configuration and launch steps for new users.
- **SAML_IDP_INITIATED_FLOW.md** – Details the SAML IdP-initiated login flow, how to trigger it in this demo, and what to expect during the process.

For more details, see each file in the `docs/` folder.

---

_Last updated: January 14, 2026_
