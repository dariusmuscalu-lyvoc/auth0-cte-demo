
import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import Welcome from "./Welcome";
import TokenExchange from "./TokenExchange";
import TokenPage from "./TokenPage";
import AdaptiveMfaPage from "./AdaptiveMfaPage";
import LogStreamsPage from "./LogStreamsPage";
import SAMLIdpInitiatedPage from "./SAMLIdpInitiatedPage";
import ActionsPage from "./ActionsPage";
import FormsPage from "./FormsPage";
import OrganizationPage from "./OrganizationPage";
// import OrganizationPage from "./OrganizationPage";

const App = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
          width:  "900px",
          marginLeft: 220,
          padding: "2rem 1rem",
        }}
      >
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/token-exchange" element={<TokenExchange />} />
          <Route path="/token" element={<TokenPage />} />
          <Route path="/adaptive-mfa" element={<AdaptiveMfaPage />} />
          <Route path="/log-streams" element={<LogStreamsPage />} />
          <Route path="/saml-idp-initiated" element={<SAMLIdpInitiatedPage />} />
          {/* <Route path="/organization" element={<OrganizationPage />} /> */}
          <Route path="/actions" element={<ActionsPage />} />
          <Route path="/forms" element={<FormsPage />} />
          <Route path="/organization" element={<OrganizationPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;