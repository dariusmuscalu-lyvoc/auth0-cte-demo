import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from "../context/ThemeContext";
import OrganizationPicker, { OrganizationBadge } from "../components/OrganizationPicker";
import ApplicationTiles, { RoleAccessSummary } from "../components/ApplicationTiles";
import {
  getAvailableBrands,
  ORGANIZATION_BRANDING,
  ROLE_APP_ACCESS,
  getOrganizationBranding,
  getOrgId,
  ApplicationAccess,
} from "../config/organizationBranding";

const sectionStyle: React.CSSProperties = {
  background: "var(--bg-secondary)",
  borderRadius: "10px",
  padding: "1.25rem 1.5rem",
  marginBottom: "1.5rem",
};

const dividerStyle: React.CSSProperties = {
  border: "none",
  borderTop: "1px solid #3a3f50",
  margin: "1rem 0",
};

const tabStyle = (active: boolean, color: string): React.CSSProperties => ({
  padding: "0.6rem 1.2rem",
  background: active ? color + "20" : "transparent",
  border: `1px solid ${active ? color : "transparent"}`,
  borderRadius: "6px",
  color: active ? color : "var(--text-muted)",
  cursor: "pointer",
  fontSize: "0.9rem",
  fontWeight: 500,
  transition: "all 0.2s ease",
});

const OrganizationPage: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();
  const { applyOrganizationTheme, currentOrgBranding } = useTheme();
  const [activeTab, setActiveTab] = useState<"demo" | "architecture" | "accounts">("demo");
  const [demoRoles, setDemoRoles] = useState<string[]>(["admin"]);
  const [selectedOrgForDemo, setSelectedOrgForDemo] = useState<string>("fluidra-es");
  const [selectedApp, setSelectedApp] = useState<ApplicationAccess | null>(null);

  const brands = getAvailableBrands();
  const selectedBranding = getOrganizationBranding(selectedOrgForDemo);
  const primaryColor = selectedBranding?.theme.primaryColor || "#63b3ed";

  const handleBrandedLogin = (orgName: string) => {
    // Use org ID for Auth0 login (required by Auth0)
    const orgId = getOrgId(orgName);
    loginWithRedirect({
      authorizationParams: {
        organization: orgId,
        redirect_uri: window.location.origin + "/token",
        scope: "openid profile email",
      },
    });
  };

  const handlePreviewTheme = (orgName: string) => {
    setSelectedOrgForDemo(orgName);
    applyOrganizationTheme(orgName);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Organizations & Branding</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
        Multi-brand, multi-country CIAM architecture using Auth0 Organizations.
        Each brand has its own visual identity, and application access is controlled by roles within each organization.
      </p>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button style={tabStyle(activeTab === "demo", primaryColor)} onClick={() => setActiveTab("demo")}>
          🎨 Live Demo
        </button>
        <button style={tabStyle(activeTab === "architecture", primaryColor)} onClick={() => setActiveTab("architecture")}>
          🏗️ Architecture
        </button>
        <button style={tabStyle(activeTab === "accounts", primaryColor)} onClick={() => setActiveTab("accounts")}>
          👤 Test Accounts
        </button>
      </div>

      {/* DEMO TAB */}
      {activeTab === "demo" && (
        <>
          {/* Brand Selection */}
          <div style={sectionStyle}>
            <h2 style={{ marginTop: 0 }}>Step 1: Select Your Brand</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
              Click a brand to preview its theme. The login page, app theme, and email templates all change based on the organization.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              {brands.map((brand) => (
                <div
                  key={brand.id}
                  onClick={() => handlePreviewTheme(`${brand.id}-es`)}
                  style={{
                    background: selectedOrgForDemo.startsWith(brand.id) ? brand.primaryColor + "20" : "var(--bg-primary)",
                    border: `2px solid ${selectedOrgForDemo.startsWith(brand.id) ? brand.primaryColor : "transparent"}`,
                    borderRadius: "10px",
                    padding: "1rem 1.5rem",
                    cursor: "pointer",
                    minWidth: "160px",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                  }}
                >
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    style={{ height: "36px", marginBottom: "0.5rem", objectFit: "contain" }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = "none";
                    }}
                  />
                  <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>{brand.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    Spain (ES)
                  </div>
                </div>
              ))}
            </div>

            {selectedBranding && (
              <div style={{ marginTop: "1.5rem", padding: "1rem", background: "var(--bg-primary)", borderRadius: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "8px",
                      background: primaryColor,
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                      {selectedBranding.displayName}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      Primary: {selectedBranding.theme.primaryColor} · Language: {selectedBranding.language}
                    </div>
                  </div>
                  <button
                    style={{
                      marginLeft: "auto",
                      background: primaryColor,
                      border: "none",
                      borderRadius: "6px",
                      padding: "0.6rem 1.2rem",
                      color: "#fff",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                    onClick={() => handleBrandedLogin(selectedOrgForDemo)}
                  >
                    Login as {selectedBranding.brandName}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Role-Based Access Demo */}
          <div style={sectionStyle}>
            <h2 style={{ marginTop: 0 }}>Step 2: Role-Based Application Access</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
              Users see different applications based on their organization roles. Select roles to preview access:
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
              {Object.keys(ROLE_APP_ACCESS).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setDemoRoles((prev) =>
                      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
                    );
                  }}
                  style={{
                    background: demoRoles.includes(role) ? primaryColor + "20" : "var(--bg-primary)",
                    border: `1px solid ${demoRoles.includes(role) ? primaryColor : "var(--text-muted)"}`,
                    borderRadius: "6px",
                    padding: "0.5rem 1rem",
                    color: demoRoles.includes(role) ? primaryColor : "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                  }}
                >
                  {role}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem" }}>
              <div>
                <h4 style={{ marginTop: 0, marginBottom: "1rem", color: "var(--text-primary)" }}>
                  Application Dashboard
                </h4>
                <ApplicationTiles
                  roles={demoRoles}
                  branding={selectedBranding}
                  showAllApps={true}
                  onAppClick={(app) => setSelectedApp(app)}
                />
              </div>
              <div>
                <h4 style={{ marginTop: 0, marginBottom: "1rem", color: "var(--text-primary)" }}>
                  Access Summary
                </h4>
                <RoleAccessSummary roles={demoRoles} primaryColor={primaryColor} />
              </div>
            </div>
          </div>

          {/* Step 3: Launch App */}
          <div style={sectionStyle}>
            <h2 style={{ marginTop: 0 }}>Step 3: Launch an Application</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
              Click an accessible app tile above to select it, then authenticate into it scoped to the selected brand.
            </p>

            {selectedApp ? (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                background: "var(--bg-primary)",
                borderRadius: "10px",
                padding: "1.25rem 1.5rem",
                border: `2px solid ${primaryColor}40`,
              }}>
                <div style={{ fontSize: "2.5rem" }}>{selectedApp.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                    {selectedApp.name}
                  </div>
                  <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                    <span style={{ background: primaryColor + "20", color: primaryColor, padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 500 }}>
                      {selectedBranding?.displayName || selectedOrgForDemo}
                    </span>
                    {" "}· Roles: {demoRoles.join(", ")}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end" }}>
                  <button
                    style={{
                      background: primaryColor,
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "0.7rem 1.4rem",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => handleBrandedLogin(selectedOrgForDemo)}
                  >
                    Launch {selectedApp.name} →
                  </button>
                  <button
                    style={{
                      background: "transparent",
                      color: "var(--text-muted)",
                      border: "none",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      padding: "0.25rem",
                    }}
                    onClick={() => setSelectedApp(null)}
                  >
                    Clear selection
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                textAlign: "center",
                padding: "2rem",
                background: "var(--bg-primary)",
                borderRadius: "10px",
                border: "2px dashed var(--text-muted)",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}>
                ← Click an accessible app tile in Step 2 to select it
              </div>
            )}
          </div>

          {/* Multi-Org User Demo */}
          <div style={sectionStyle}>
            <h2 style={{ marginTop: 0 }}>Multi-Organization Users</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "1rem" }}>
              When a user belongs to multiple organizations, there are two routing patterns:
            </p>
            <ul style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              <li><strong>Pattern A (Silent routing):</strong> App passes <code>?org=fluidra-es</code> in the URL → user enters credentials → authenticated directly into that brand.</li>
              <li><strong>Pattern B (In-login org picker):</strong> App omits the org parameter → user enters credentials → Auth0 detects their org memberships and presents them as selectable buttons → user picks one → authenticated into that org.</li>
            </ul>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button
                style={{
                  background: "var(--bg-primary)",
                  border: `1px solid ${primaryColor}`,
                  borderRadius: "6px",
                  padding: "0.75rem 1.5rem",
                  color: primaryColor,
                  cursor: "pointer",
                  fontWeight: 500,
                }}
                onClick={() => handleBrandedLogin("fluidra-es")}
              >
                Login with org=fluidra-es (Silent)
              </button>
              <button
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--text-muted)",
                  borderRadius: "6px",
                  padding: "0.75rem 1.5rem",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
                onClick={() =>
                  loginWithRedirect({
                    authorizationParams: {
                      redirect_uri: window.location.origin + "/token",
                      scope: "openid profile email",
                    },
                  })
                }
              >
                Login without org (Show Org Picker)
              </button>
            </div>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
              Use <code>multi@demo.com</code> / <code>Password123!</code> with the org picker — this user belongs to multiple organizations and will see them as selectable options after entering credentials.
            </p>
          </div>
        </>
      )}

      {/* ARCHITECTURE TAB */}
      {activeTab === "architecture" && (
        <>
          <div style={sectionStyle}>
            <h2 style={{ marginTop: 0 }}>🏗️ The Model: 1 Org per Brand (Expandable to N Countries)</h2>
            <p style={{ color: "var(--text-secondary)" }}>
              Each Auth0 Organization = one brand (+ country when expanded). Currently configured with Spain (ES) only.
              Applications are NOT separate organizations — they are scoped within the organization via roles.
            </p>

            <hr style={dividerStyle} />

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
                <thead>
                  <tr style={{ background: "var(--bg-primary)" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", color: "var(--text-primary)" }}>Brand</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", color: "var(--text-primary)" }}>Auth0 Organizations</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", color: "var(--text-primary)" }}>Applications in Scope</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map((brand) => (
                    <tr key={brand.id} style={{ borderBottom: "1px solid var(--bg-primary)" }}>
                      <td style={{ padding: "0.75rem", fontWeight: 600, color: brand.primaryColor }}>
                        {brand.name}
                      </td>
                      <td style={{ padding: "0.75rem", color: "var(--text-secondary)" }}>
                        <code style={{ fontSize: "0.8rem" }}>
                          {brand.countries.map((c) => c.orgName).join(" · ")}
                        </code>
                      </td>
                      <td style={{ padding: "0.75rem", color: "var(--text-secondary)" }}>
                        {brand.id === "fluidra"
                          ? "eSales · Media Center · Pro Academy · Pro Lab · Pro App"
                          : brand.id === "astralpool"
                          ? "eSales · Media Center · Pro Academy"
                          : "eSales · Media Center"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ marginTop: 0 }}>🔑 Key Design Decisions</h2>
            <ul style={{ color: "var(--text-secondary)", lineHeight: 1.8 }}>
              <li>
                <strong>One organization per brand per country</strong> (e.g., fluidra-es, astralpool-uk, grepool-pt).
                This is the finest granularity at which branding, language, and support contact differ.
              </li>
              <li>
                <strong>Applications are NOT separate organizations.</strong> Whether a user has access to eSales,
                Media Center, Pro Academy, Pro Lab, or Pro App is controlled by their role/permissions within the
                organization — not by which organization they are in.
              </li>
              <li>
                <strong>A single Auth0 database connection can serve all organizations.</strong> Users are stored
                once and added as members to one or more organizations.
              </li>
              <li>
                <strong>Brand is URL-driven:</strong> the PRO AREA portal passes the <code>org</code> parameter in
                the authorization URL, telling Auth0 which organization the user is logging into. Auth0 then
                presents the correct branded Universal Login page.
              </li>
            </ul>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ marginTop: 0 }}>👥 User Personas</h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {[
                {
                  title: "Single-Brand Buyer",
                  org: "fluidra-es",
                  roles: ["buyer"],
                  apps: ["eSales"],
                  description: "Most common user type. Direct login to one brand.",
                },
                {
                  title: "B2B Customer",
                  org: "fluidra-es",
                  roles: ["b2b_customer"],
                  apps: ["Media Center", "Pro Academy", "Pro Lab"],
                  description: "Access to training and technical tools.",
                },
                {
                  title: "Multi-Brand Buyer",
                  org: "fluidra-es, grepool-es, astralpool-es",
                  roles: ["buyer"],
                  apps: ["eSales (per org)"],
                  description: "Uses org picker to switch between brands.",
                },
                {
                  title: "Organization Admin",
                  org: "fluidra-es",
                  roles: ["admin"],
                  apps: ["All 5 apps"],
                  description: "Full access to all applications.",
                },
              ].map((persona, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--bg-primary)",
                    borderRadius: "8px",
                    padding: "1rem",
                    borderLeft: `3px solid ${primaryColor}`,
                  }}
                >
                  <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                    {persona.title}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                    {persona.description}
                  </div>
                  <div style={{ fontSize: "0.8rem" }}>
                    <div><strong>Org:</strong> <code>{persona.org}</code></div>
                    <div><strong>Roles:</strong> {persona.roles.join(", ")}</div>
                    <div><strong>Apps:</strong> {persona.apps.join(", ")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ACCOUNTS TAB */}
      {activeTab === "accounts" && (
        <>
          <div style={sectionStyle}>
            <h2 style={{ marginTop: 0 }}>👤 Test Accounts</h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              Use these credentials to test different user scenarios. Each account demonstrates a specific persona or access pattern.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1rem" }}>
              
              {/* Fluidra Admin */}
              <div style={{ background: "var(--bg-primary)", borderRadius: "8px", padding: "1rem", borderLeft: "3px solid #005BAC" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>👑</span>
                  <strong style={{ color: "var(--text-primary)" }}>Fluidra Admin</strong>
                  <span style={{ background: "#005BAC20", color: "#005BAC", padding: "0.15rem 0.5rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 500 }}>ADMIN</span>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: "0.85rem", background: "var(--bg-secondary)", padding: "0.75rem", borderRadius: "6px" }}>
                  <div><span style={{ color: "var(--text-muted)" }}>Email:</span> <span style={{ color: "var(--text-primary)" }}>admin@fluidra.com</span></div>
                  <div><span style={{ color: "var(--text-muted)" }}>Password:</span> <span style={{ color: "var(--text-primary)" }}>Password123!</span></div>
                  <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid var(--bg-primary)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Org:</span> <span style={{ color: "#005BAC" }}>fluidra-es</span>
                  </div>
                  <div><span style={{ color: "var(--text-muted)" }}>Roles:</span> <span style={{ color: "var(--text-secondary)" }}>admin</span></div>
                  <div><span style={{ color: "var(--text-muted)" }}>Access:</span> <span style={{ color: "var(--text-secondary)" }}>All 5 apps</span></div>
                </div>
                <button
                  onClick={() => handleBrandedLogin("fluidra-es")}
                  style={{ marginTop: "0.75rem", background: "#005BAC", color: "#fff", border: "none", borderRadius: "6px", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: 500, fontSize: "0.85rem" }}
                >
                  Login as Fluidra Admin
                </button>
              </div>

              {/* Fluidra B2B Customer */}
              <div style={{ background: "var(--bg-primary)", borderRadius: "8px", padding: "1rem", borderLeft: "3px solid #005BAC" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>🔧</span>
                  <strong style={{ color: "var(--text-primary)" }}>Fluidra B2B Customer</strong>
                  <span style={{ background: "#005BAC20", color: "#005BAC", padding: "0.15rem 0.5rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 500 }}>B2B</span>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: "0.85rem", background: "var(--bg-secondary)", padding: "0.75rem", borderRadius: "6px" }}>
                  <div><span style={{ color: "var(--text-muted)" }}>Email:</span> <span style={{ color: "var(--text-primary)" }}>demo@fluidra.com</span></div>
                  <div><span style={{ color: "var(--text-muted)" }}>Password:</span> <span style={{ color: "var(--text-primary)" }}>Password123!</span></div>
                  <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid var(--bg-primary)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Org:</span> <span style={{ color: "#005BAC" }}>fluidra-es</span>
                  </div>
                  <div><span style={{ color: "var(--text-muted)" }}>Roles:</span> <span style={{ color: "var(--text-secondary)" }}>b2b_customer</span></div>
                  <div><span style={{ color: "var(--text-muted)" }}>Access:</span> <span style={{ color: "var(--text-secondary)" }}>Media Center, Pro Academy, Pro Lab</span></div>
                </div>
                <button
                  onClick={() => handleBrandedLogin("fluidra-es")}
                  style={{ marginTop: "0.75rem", background: "#005BAC", color: "#fff", border: "none", borderRadius: "6px", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: 500, fontSize: "0.85rem" }}
                >
                  Login as B2B Customer
                </button>
              </div>

              {/* Multi-Org User */}
              <div style={{ background: "var(--bg-primary)", borderRadius: "8px", padding: "1rem", borderLeft: "3px solid #805ad5" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>🌍</span>
                  <strong style={{ color: "var(--text-primary)" }}>Multi-Org User</strong>
                  <span style={{ background: "#805ad520", color: "#805ad5", padding: "0.15rem 0.5rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 500 }}>MULTI</span>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: "0.85rem", background: "var(--bg-secondary)", padding: "0.75rem", borderRadius: "6px" }}>
                  <div><span style={{ color: "var(--text-muted)" }}>Email:</span> <span style={{ color: "var(--text-primary)" }}>multi@demo.com</span></div>
                  <div><span style={{ color: "var(--text-muted)" }}>Password:</span> <span style={{ color: "var(--text-primary)" }}>Password123!</span></div>
                  <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid var(--bg-primary)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Orgs:</span> <span style={{ color: "#805ad5" }}>fluidra-es, grepool-es, astralpool-es</span>
                  </div>
                  <div><span style={{ color: "var(--text-muted)" }}>Roles:</span> <span style={{ color: "var(--text-secondary)" }}>buyer (all orgs)</span></div>
                  <div><span style={{ color: "var(--text-muted)" }}>Access:</span> <span style={{ color: "var(--text-secondary)" }}>eSales (per org)</span></div>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.5rem 0 0" }}>
                  💡 Login without org param to see org picker
                </p>
              </div>

              {/* Grepool Buyer */}
              <div style={{ background: "var(--bg-primary)", borderRadius: "8px", padding: "1rem", borderLeft: "3px solid #ED8936" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "1.25rem" }}>🛒</span>
                  <strong style={{ color: "var(--text-primary)" }}>Grepool Buyer</strong>
                  <span style={{ background: "#ED893620", color: "#ED8936", padding: "0.15rem 0.5rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: 500 }}>BUYER</span>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: "0.85rem", background: "var(--bg-secondary)", padding: "0.75rem", borderRadius: "6px" }}>
                  <div><span style={{ color: "var(--text-muted)" }}>Email:</span> <span style={{ color: "var(--text-primary)" }}>buyer@grepool.com</span></div>
                  <div><span style={{ color: "var(--text-muted)" }}>Password:</span> <span style={{ color: "var(--text-primary)" }}>Password123!</span></div>
                  <div style={{ marginTop: "0.5rem", paddingTop: "0.5rem", borderTop: "1px solid var(--bg-primary)" }}>
                    <span style={{ color: "var(--text-muted)" }}>Org:</span> <span style={{ color: "#ED8936" }}>grepool-es</span>
                  </div>
                  <div><span style={{ color: "var(--text-muted)" }}>Roles:</span> <span style={{ color: "var(--text-secondary)" }}>buyer</span></div>
                  <div><span style={{ color: "var(--text-muted)" }}>Access:</span> <span style={{ color: "var(--text-secondary)" }}>eSales only</span></div>
                </div>
                <button
                  onClick={() => handleBrandedLogin("grepool-es")}
                  style={{ marginTop: "0.75rem", background: "#ED8936", color: "#fff", border: "none", borderRadius: "6px", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: 500, fontSize: "0.85rem" }}
                >
                  Login as Grepool Buyer
                </button>
              </div>

            </div>
          </div>

          {/* User Reference */}
          <div style={sectionStyle}>
            <h2 style={{ marginTop: 0 }}>📋 Configured Users</h2>
            
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ background: "var(--bg-primary)" }}>
                    <th style={{ padding: "0.75rem", textAlign: "left", color: "var(--text-primary)" }}>Email</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", color: "var(--text-primary)" }}>Organization(s)</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", color: "var(--text-primary)" }}>Roles</th>
                    <th style={{ padding: "0.75rem", textAlign: "left", color: "var(--text-primary)" }}>Demo Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid var(--bg-primary)" }}>
                    <td style={{ padding: "0.75rem" }}><code>admin@fluidra.com</code></td>
                    <td style={{ padding: "0.75rem" }}>fluidra-es</td>
                    <td style={{ padding: "0.75rem" }}>admin</td>
                    <td style={{ padding: "0.75rem", color: "var(--text-muted)" }}>Full access demo</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--bg-primary)" }}>
                    <td style={{ padding: "0.75rem" }}><code>demo@fluidra.com</code></td>
                    <td style={{ padding: "0.75rem" }}>fluidra-es</td>
                    <td style={{ padding: "0.75rem" }}>b2b_customer</td>
                    <td style={{ padding: "0.75rem", color: "var(--text-muted)" }}>B2B customer persona</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid var(--bg-primary)" }}>
                    <td style={{ padding: "0.75rem" }}><code>multi@demo.com</code></td>
                    <td style={{ padding: "0.75rem" }}>fluidra-es, grepool-es, astralpool-es</td>
                    <td style={{ padding: "0.75rem" }}>buyer</td>
                    <td style={{ padding: "0.75rem", color: "var(--text-muted)" }}>Multi-org picker demo</td>
                  </tr>
                  <tr>
                    <td style={{ padding: "0.75rem" }}><code>buyer@grepool.com</code></td>
                    <td style={{ padding: "0.75rem" }}>grepool-es</td>
                    <td style={{ padding: "0.75rem" }}>buyer</td>
                    <td style={{ padding: "0.75rem", color: "var(--text-muted)" }}>Brand switching demo</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: "1rem", padding: "0.75rem", background: "var(--bg-primary)", borderRadius: "6px", fontSize: "0.85rem" }}>
              <strong style={{ color: "var(--text-primary)" }}>Default Password for all accounts:</strong>
              <code style={{ marginLeft: "0.5rem", background: "var(--bg-secondary)", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>Password123!</code>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrganizationPage;
