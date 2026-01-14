
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

- **Auth0 Tenant:** _[Insert your Auth0 tenant domain]_  
- **Client ID:** _[Insert Auth0 client ID]_  
- **Client Secret:** _[Insert Auth0 client secret]_  
- **API Audience:** _[Insert API audience]_  

> _Update these fields with your actual Auth0 tenant and application credentials. Do not commit real secrets to version control._

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

### 6. Useful Links
- [AUTH0_SETUP_GUIDE.md](./AUTH0_SETUP_GUIDE.md) – Full Auth0 setup
- [README.md](./README.md) – Project overview and usage

---

_Last updated: January 14, 2026_
