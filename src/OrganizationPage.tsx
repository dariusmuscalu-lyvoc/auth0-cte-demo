
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";


const OrganizationPage: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const handleOrgLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        organization: "org_NuioIiSZARzIcDR9",
        redirect_uri: window.location.origin + "/token",
        scope: "openid profile email"
      }
    });
  };

  return (
    <div style={{ padding: 24 }}>
    <h2>Auth0 Organizations</h2>
    <p>
      <b>Organizations</b> in Auth0 allow you to model business customers, partners, or teams as first-class entities. Each organization can have its own set of users, connections, roles, and branding. This is especially useful for B2B SaaS applications where you need to manage access and authentication for multiple customer organizations.
    </p>
    <p>
      <b>Key Concepts:</b>
      <ul>
        <li>Each user can belong to one or more organizations.</li>
        <li>Organizations can have their own login experience and branding.</li>
        <li>Access can be managed at the organization level, including roles and permissions.</li>
        <li>Login flows can be customized per organization using the <code>org_id</code> parameter.</li>
      </ul>
    </p>
    <p>
      <b>Try Organization Login:</b>
    </p>
    <button
      onClick={handleOrgLogin}
      style={{
        marginTop: 24,
        background: "#805ad5",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "0.9rem 1.2rem",
        fontWeight: 600,
        fontSize: 16,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      Login with Organization (org_NuioIiSZARzIcDR9)
    </button>
  </div>
  );
};

export default OrganizationPage;
