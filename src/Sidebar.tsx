import { NavLink, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Sidebar = () => {
  const { loginWithRedirect, logout } = useAuth0();


  const handlePasswordless = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: "email", // Change to your passwordless connection name (e.g., "email" or "sms")
        redirect_uri: window.location.origin + "/token"
      }
    });
  };

  const handleOktaWorkforce = () => {
    loginWithRedirect({
      authorizationParams: {
        connection: "lyvoc", // Okta Workforce connection name
        redirect_uri: window.location.origin + "/token"
      }
    });
  };
  const handleSamlLogin = () => {
    loginWithRedirect({
      authorizationParams: {
        // Use the SAML connection configured in the dashboard
        connection: "SAML-Auth0-IDP",
        redirect_uri: window.location.origin + "/token"
      }
    });
  };
  const navigate = useNavigate();
  const handleIdpPortal = () => {
    navigate("/saml-idp-initiated");
  };

  return (
    <nav
      style={{
        width: 220,
        background: "#23263a",
        minHeight: "100vh",
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 12px rgba(0,0,0,0.15)",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <div style={{ color: "#f7fafc", fontWeight: 700, fontSize: 18 }}>Auth0 CIC Demo</div>
      </div>
      <NavLink to="/" end style={({ isActive }) => ({
        color: isActive ? "#63b3ed" : "#e2e8f0",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
      })}>
        Welcome
      </NavLink>
      <NavLink to="/actions" style={({ isActive }) => ({
        color: isActive ? "#63b3ed" : "#e2e8f0",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
        display: "block",
      })}>
        Actions
      </NavLink>
      <NavLink to="/token-exchange" style={({ isActive }) => ({
        color: isActive ? "#63b3ed" : "#e2e8f0",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
      })}>
        Custom Token Exchange
      </NavLink>
      <NavLink to="/adaptive-mfa" style={({ isActive }) => ({
        color: isActive ? "#63b3ed" : "#e2e8f0",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
      })}>
        Adaptive MFA
      </NavLink>
      <NavLink to="/token" style={({ isActive }) => ({
        color: isActive ? "#63b3ed" : "#e2e8f0",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
      })}>
        Token / Profile
      </NavLink>

      <NavLink to="/log-streams" style={({ isActive }) => ({
        color: isActive ? "#63b3ed" : "#e2e8f0",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
      })}>
        Log Streams
      </NavLink>


      <NavLink to="/forms" style={({ isActive }) => ({
        color: isActive ? "#63b3ed" : "#e2e8f0",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
      })}>
        Forms
      </NavLink>

      <NavLink to="/organization" style={({ isActive }) => ({
        color: isActive ? "#63b3ed" : "#e2e8f0",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
      })}>
        Organization
      </NavLink>

      <button
        onClick={handleIdpPortal}
        style={{
          marginTop: 16,
          background: "#2b6cb0",
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
        SAML IDP Initiated
      </button>
      <button
        onClick={handlePasswordless}
        style={{
          marginTop: 16,
          background: "#ed8936",
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
        Passwordless Login
      </button>
      {/*
      <button
        onClick={() => {
          window.location.href = "https://demo-lyvoc.eu.auth0.com/auth0-delegated-admin";
        }}
        style={{
          marginTop: 16,
          background: "#38a169",
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
        DAE Admin Login
      </button>
      */}
      <button
        onClick={handleOktaWorkforce}
        style={{
          marginTop: 16,
          background: "#63b3ed",
          color: "#23263a",
          border: "none",
          borderRadius: 8,
          padding: "0.9rem 1.2rem",
          fontWeight: 600,
          fontSize: 16,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        Okta Workforce OIDC
      </button>
      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to log out?")) {
            // Clear IdP-initiated tokens from localStorage
            localStorage.removeItem('idp_id_token');
            localStorage.removeItem('idp_access_token');
            logout({ logoutParams: { returnTo: window.location.origin, federated: true } });
          }
        }}
        style={{
          marginTop: 16,
          background: "#c53030",
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
        Log Out
      </button>
    </nav>
  );
};

export default Sidebar;
