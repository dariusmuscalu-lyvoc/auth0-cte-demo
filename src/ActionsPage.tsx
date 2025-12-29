import React from "react";

const webhookExample = `/**
 * Auth0 Post-Login Action: Push User Info to Webhook.site
 *
 * Purpose:
 *   - After a successful login, this action sends basic user info to an external HTTP endpoint.
 *   - Useful for demoing outbound integrations, user sync, or audit logging.
 *
 * How to use:
 *   1. Copy this code into a new Post-Login Action in your Auth0 dashboard.
 *   2. Replace the URL below with your own endpoint if needed (currently set to webhook.site for demo).
 *   3. Deploy and attach the Action to your Login flow.
 *   4. Log in to your app; check the external service (webhook.site) for the POSTed data.
 *
 * What to change:
 *   - Change the URL to your real service for production use.
 *   - Add/remove fields in the body as needed for your use case.
 */

exports.onExecutePostLogin = async (event, api) => {
  await fetch("https://webhook.site/1ffeaca0-6569-4ee8-9cd0-34a5a660994f", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: event.user.email,      // User's email address
      name: event.user.name,        // User's display name
      user_id: event.user.user_id,  // Auth0 user ID
      login_time: event.transaction?.timestamp // Login timestamp
    })
  });
};
// Login / Post Login, Runtime: Node 22 (Recommended)
`;

const adaptiveMfaExplanation = `Adaptive MFA Action\n\nPurpose:\n- Enforces step-up MFA for database users if they have not performed MFA in the last 12 hours.\n- Uses Auth0 Management API to check user's enrolled authenticators and last authentication time.\n- If no MFA enrolled or last MFA was more than 12 hours ago, prompts for MFA during login.\n`;

const adaptiveMfaExample = `function checkLastMfa(mfaAuthenticator) {\n  console.log("---Check Last MFA----");\n  const lastMFADate = mfaAuthenticator.map((auth) =>\n    new Date(auth.last_auth_at).getTime()\n  );\n  const mostRecentTimestamp = Math.max(...lastMFADate);\n  const mostRecentDate = new Date(mostRecentTimestamp);\n  const currentDate = new Date();\n\n  const differenceInHours =\n    (currentDate.getTime() - mostRecentDate.getTime()) / (1000 * 60 * 60);\n  return differenceInHours > 12;\n}\n\n/**\n * Handler that will be called during the execution of a PostLogin flow.\n *\n * @param {Event} event - Details about the user and the context in which they are logging in.\n * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.\n */\nexports.onExecutePostLogin = async (event, api) => {\n  console.log("MFA::execute:start");\n\n  const isDBUser = event.connection.strategy === "auth0";\n\n  if (isDBUser) {\n    const { ManagementClient } = require("auth0");\n    const management = new ManagementClient({\n      domain: event.secrets.AUTH0_DOMAIN,\n      clientId: event.secrets.AUTH0_CLIENT_ID,\n      clientSecret: event.secrets.AUTH0_CLIENT_SECRET,\n    });\n\n    const response = await management.users.getAuthenticationMethods({\n      id: event.user.user_id,\n    });\n    const mfaAuthenticator = response.data;\n\n    if (mfaAuthenticator.length == 0) {\n      console.log("No MFA enrolled");\n      api.multifactor.enable("any");\n      return;\n    }\n\n    if (checkLastMfa(mfaAuthenticator)) {\n      console.log("Last MFA was more than 12 hours ago");\n      api.multifactor.enable("any");\n      return;\n    }\n\n  }\n};\n`;

const customClaimsExplanation = `Custom Claims Action\n\nPurpose:\n- Adds custom claims to the ID token during the Post-Login flow.\n- Useful for including user roles, preferences, or other app-specific data in the token.\n- Claims can be consumed by your frontend or APIs for authorization and personalization.\n`;

const customClaimsExample = `/**\n* Handler that will be called during the execution of a PostLogin flow.\n*\n* @param {Event} event - Details about the user and the context in which they are logging in.\n* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.\n*/\nexports.onExecutePostLogin = async (event, api) => {\n  api.idToken.setCustomClaim(\"https://demo-app.example.com/custom_role\", \"admin\");\n  api.idToken.setCustomClaim(\"https://demo-app.example.com/theme\", \"dark\");\n  // You can add more claims as needed\n};\n\n/**\n* Handler that will be invoked when this action is resuming after an external redirect. If your\n* onExecutePostLogin function does not perform a redirect, this function can be safely ignored.\n*\n* @param {Event} event - Details about the user and the context in which they are logging in.\n* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.\n*/\n// exports.onContinuePostLogin = async (event, api) => {\n// };\n\nCustom Claims\nLogin / Post Login, Runtime: Node 22 (Recommended)\n`;

const ActionsPage = () => (
  <div style={{ maxWidth: 800, margin: "2rem auto", background: "#23263a", borderRadius: 12, padding: "2rem" }}>
    <h2 style={{ color: "#ed8936", marginBottom: 18 }}>Auth0 Actions</h2>
    <p style={{ color: "#a0aec0", fontSize: 18, marginBottom: 24 }}>
      <b>Actions</b> in Auth0 are secure, extensible functions that execute at specific points in the authentication and authorization pipeline. They allow you to customize and extend Auth0's behavior, such as adding custom claims, integrating with external APIs, or enforcing business logic during login, user registration, token issuance, and more.
    </p>
    <ul style={{ color: "#e2e8f0", fontSize: 16, marginLeft: 24 }}>
      <li><b>Post-Login:</b> Run after a user successfully authenticates. Add claims, call APIs, or modify tokens.</li>
      <li><b>Pre-User Registration:</b> Validate or enrich user data before registration completes.</li>
      <li><b>Post-User Registration:</b> Trigger actions after a new user signs up (e.g., send welcome emails).</li>
      <li><b>Machine to Machine:</b> Customize token issuance for client credentials flows.</li>
      <li><b>Custom Token Exchange:</b> Triggered during custom token exchange flows to validate, transform, or enrich tokens between identity providers.</li>
    </ul>
    <p style={{ color: "#63b3ed", marginTop: 24 }}>
      Actions are managed in the Auth0 Dashboard under <b>Actions</b>. They are the recommended way to extend Auth0, replacing legacy Rules and Hooks.
    </p>
    <div style={{ marginTop: 40, background: "#23263a", borderRadius: 8, padding: "1.5rem" }}>
      <h3 style={{ color: "#ed8936", marginBottom: 12 }}>Example: Push User Info to Webhook</h3>
      <pre style={{ background: "#1a202c", color: "#e2e8f0", padding: 16, borderRadius: 6, fontSize: 15, overflowX: "auto" }} dangerouslySetInnerHTML={{ __html: webhookExample.replace(/</g, '&lt;').replace(/>/g, '&gt;') }} />
    </div>
    <div style={{ marginTop: 40, background: "#23263a", borderRadius: 8, padding: "1.5rem" }}>
      <h3 style={{ color: "#ed8936", marginBottom: 12 }}>Example: Adaptive MFA</h3>
      <div style={{ color: "#a0aec0", fontSize: 16, marginBottom: 16, whiteSpace: "pre-line" }}>{adaptiveMfaExplanation}</div>
      <pre style={{ background: "#1a202c", color: "#e2e8f0", padding: 16, borderRadius: 6, fontSize: 15, overflowX: "auto" }} dangerouslySetInnerHTML={{ __html: adaptiveMfaExample.replace(/</g, '&lt;').replace(/>/g, '&gt;') }} />
    </div>
    <div style={{ marginTop: 40, background: "#23263a", borderRadius: 8, padding: "1.5rem" }}>
      <h3 style={{ color: "#ed8936", marginBottom: 12 }}>Example: Custom Claims</h3>
      <div style={{ color: "#a0aec0", fontSize: 16, marginBottom: 16, whiteSpace: "pre-line" }}>{customClaimsExplanation}</div>
      <pre style={{ background: "#1a202c", color: "#e2e8f0", padding: 16, borderRadius: 6, fontSize: 15, overflowX: "auto" }} dangerouslySetInnerHTML={{ __html: customClaimsExample.replace(/</g, '&lt;').replace(/>/g, '&gt;') }} />
    </div>
  </div>
);

export default ActionsPage;
