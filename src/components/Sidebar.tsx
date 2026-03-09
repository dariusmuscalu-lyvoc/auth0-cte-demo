import { NavLink, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from "../context/ThemeContext";
import { OrganizationBadge } from "./OrganizationPicker";

const Sidebar = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  const { theme, currentOrgBranding } = useTheme();


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
        redirect_uri: window.location.origin + "/token",
        prompt: "login" // Force credential prompt even if SSO session exists
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
        background: "var(--bg-sidebar)",
        height: "100vh",
        padding: "2rem 1rem",
        display: "flex",
        flexDirection: "column",
        boxShadow: "2px 0 12px rgba(0,0,0,0.15)",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 10,
        overflowY: "auto",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: "2rem", textAlign: "center" }}>
        <img
          src={theme.logoUrl && theme.logoUrl.trim() ? theme.logoUrl : "https://www.fluidra.com/wp-content/uploads/2024/07/Logo.webp"}
          alt="Logo"
          style={{ maxWidth: 140, maxHeight: 60, marginBottom: 12, objectFit: "contain" }}
        />
        <div style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: 18 }}>
          {theme.customerName && theme.customerName.trim() ? theme.customerName : "Fluidra"} CIC Demo
        </div>
        
        {/* Organization Badge */}
        {currentOrgBranding && isAuthenticated && (
          <div style={{ marginTop: "1rem" }}>
            <OrganizationBadge
              orgName={currentOrgBranding.brandId + "-" + currentOrgBranding.country}
              displayName={currentOrgBranding.displayName}
              logoUrl={currentOrgBranding.logoUrl}
              primaryColor={currentOrgBranding.theme.primaryColor}
              onSwitch={() => {
                // Navigate to organization page to switch
                window.location.href = "/organization";
              }}
            />
          </div>
        )}
      </div>
      <NavLink to="/" end style={({ isActive }) => ({
        color: isActive ? "var(--primary-color)" : "var(--text-secondary)",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
      })}>
        Welcome
      </NavLink>
      <NavLink to="/actions" style={({ isActive }) => ({
        color: isActive ? "var(--primary-color)" : "var(--text-secondary)",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
        display: "block",
      })}>
        Actions
      </NavLink>
      <NavLink to="/token-exchange" style={({ isActive }) => ({
        color: isActive ? "var(--primary-color)" : "var(--text-secondary)",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
      })}>
        Custom Token Exchange
      </NavLink>
      <NavLink to="/adaptive-mfa" style={({ isActive }) => ({
        color: isActive ? "var(--primary-color)" : "var(--text-secondary)",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
      })}>
        Adaptive MFA
      </NavLink>
      <NavLink to="/token" style={({ isActive }) => ({
        color: isActive ? "var(--primary-color)" : "var(--text-secondary)",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
      })}>
        Token / Profile
      </NavLink>

      <NavLink to="/log-streams" style={({ isActive }) => ({
        color: isActive ? "var(--primary-color)" : "var(--text-secondary)",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
      })}>
        Log Streams
      </NavLink>


      <NavLink to="/forms" style={({ isActive }) => ({
        color: isActive ? "var(--primary-color)" : "var(--text-secondary)",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
      })}>
        Forms
      </NavLink>


      <NavLink to="/organization" style={({ isActive }) => ({
        color: isActive ? "var(--primary-color)" : "var(--text-secondary)",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 17,
        marginBottom: 16,
      })}>
        Organization
      </NavLink>

      <NavLink
        to="/dae-extension"
        style={({ isActive }) => ({
          color: isActive ? "#63b3ed" : "#e2e8f0",
          background: isActive ? "#23263a" : "#2b6cb0",
          border: isActive ? "2px solid #63b3ed" : "none",
          borderRadius: 8,
          padding: "0.9rem 1.2rem",
          fontWeight: 600,
          fontSize: 16,
          marginTop: 16,
          marginBottom: 8,
          display: "block",
          textDecoration: "none",
          textAlign: "left",
          transition: "background 0.2s, color 0.2s",
        })}
      >
        DAE Extension
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

      {/* Universal Login Button */}
      <button
        onClick={() => loginWithRedirect()}
        style={{
          marginTop: 16,
          background: "#5830c5ff",
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
        Universal Login
      </button>
      <button
        onClick={() => {
          if (window.confirm("Are you sure you want to log out?")) {
            // Enhanced universal logout - clear all browser storage
            localStorage.clear();
            sessionStorage.clear();
            
            // Clear Auth0 cache if available
            if ('caches' in window) {
              caches.keys().then(names => {
                names.forEach(name => {
                  if (name.includes('auth0') || name.includes('token')) {
                    caches.delete(name);
                  }
                });
              });
            }
            
            // Small delay to ensure cleanup completes before logout
            setTimeout(() => {
              logout({ 
                logoutParams: { 
                  returnTo: window.location.origin, 
                  federated: true,
                  // Force logout from IdP regardless of session state
                  prompt: 'none'
                } 
              });
            }, 100);
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
      {/* Spacer to push settings to bottom */}
      <div style={{ flex: 1 }} />

      <NavLink to="/settings" style={({ isActive }) => ({
        color: isActive ? "var(--primary-color)" : "var(--text-secondary)",
        textDecoration: "none",
        fontWeight: 600,
        fontSize: 15,
        paddingTop: 16,
        borderTop: "1px solid var(--text-muted)",
        marginTop: 16,
      })}>
        ⚙ Settings
      </NavLink>    </nav>
  );
};

export default Sidebar;
