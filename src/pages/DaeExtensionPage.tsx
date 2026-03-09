import React from 'react';

const sectionStyle: React.CSSProperties = {
  background: '#2d313c',
  borderRadius: '10px',
  padding: '1.25rem 1.5rem',
  marginBottom: '1rem',
};

const credentialStyle: React.CSSProperties = {
  background: '#1a1e27',
  padding: '0.75rem 1rem',
  borderRadius: '6px',
  marginTop: '0.5rem',
  fontFamily: 'monospace',
  fontSize: '0.88rem',
  lineHeight: 1.7,
};

const buttonStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '0.6rem 1.2rem',
  borderRadius: '8px',
  border: 'none',
  fontWeight: 600,
  fontSize: '0.95rem',
  cursor: 'pointer',
  textDecoration: 'none',
  marginRight: '0.75rem',
  marginTop: '0.5rem',
};

const dividerStyle: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #3a3f50',
  margin: '0.85rem 0',
};

const DaeExtensionPage: React.FC = () => (
  <div style={{ padding: '2rem', maxWidth: '900px' }}>
    <h1>Delegated Administration Extension (DAE)</h1>
    <p style={{ color: 'var(--text-secondary)' }}>
      The <strong>DAE</strong> allows a Fluidra admin to manage users across all organizations — creating accounts,
      updating profiles, and setting custom attributes — without requiring full Auth0 Dashboard access.
    </p>

    <div style={{ marginBottom: '1.5rem' }}>
      <a
        href="https://auth0.com/docs/customize/extensions/delegated-administration-extension"
        target="_blank"
        rel="noopener noreferrer"
        style={{ ...buttonStyle, background: '#4a5568', color: '#fff' }}
      >
        Auth0 Documentation
      </a>
      <a
        href="https://demo-lyvoc.eu.webtask.run/auth0-delegated-admin"
        target="_blank"
        rel="noopener noreferrer"
        style={{ ...buttonStyle, background: '#005BAC', color: '#fff' }}
      >
        Open DAE App
      </a>
    </div>

    <h2>Use Cases</h2>

    {/* Create User */}
    <div style={sectionStyle}>
      <h3 style={{ marginTop: 0 }}>Create a User via Invitation</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Log in to the DAE as a Fluidra admin. Create a new user — the write hook automatically sends them an
        organization invitation email instead of setting a password directly. The user clicks the link in the
        email to set their own password and join the org.
      </p>
      <div style={credentialStyle}>
        <span style={{ color: '#a78bfa' }}>Log in as:</span> admin@fluidra.com / Password123!
      </div>
      <p style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
        In the DAE: click <strong>Create User</strong> → fill in email, connection, select <strong>Business Role</strong> (e.g. Grepool Buyer) → click <strong>Create</strong>.<br />
        The new user receives an invitation email → clicks the link → sets their password → joins the organization.
      </p>
    </div>

    <hr style={dividerStyle} />

    {/* Custom Attributes */}
    <div style={sectionStyle}>
      <h3 style={{ marginTop: 0 }}>Set Custom Attributes</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Log in as the Fluidra admin and set <code>user_metadata</code> on a user from a <strong>different organization</strong> —
        demonstrating that a cross-org admin can manage any user regardless of their org.
      </p>
      <div style={credentialStyle}>
        <span style={{ color: '#a78bfa' }}>Log in as:</span> admin@fluidra.com / Password123!<br />
        <span style={{ color: '#a78bfa' }}>Target user:</span> buyer@grepool.com (grepool-es)
      </div>
      <p style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
        Click on <strong>buyer@grepool.com</strong> → click <strong>Change Profile</strong> → fill in <strong>Tier</strong>, <strong>Region</strong>, or <strong>Preferred Language</strong> → click <strong>Update</strong>.
      </p>
    </div>

    <hr style={dividerStyle} />

    {/* Scoped Access */}
    <div style={sectionStyle}>
      <h3 style={{ marginTop: 0 }}>Scoped Admin Access</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Log in as the Grepool admin to show that a scoped admin can only see and manage users within their own organization —
        contrasting with the Fluidra admin who sees everyone.
      </p>
      <div style={credentialStyle}>
        <span style={{ color: '#a78bfa' }}>Log in as:</span> admin@grepool.com / Password123!<br />
        <span style={{ color: '#a78bfa' }}>Observe:</span> only grepool-es users are visible in the list
      </div>
      <p style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
        Open the DAE and compare the user list with what <strong>admin@fluidra.com</strong> sees. The filter hook restricts visibility based on the admin's organization.
      </p>
    </div>

    <hr style={dividerStyle} />

    {/* How Hooks Work */}
    <h2 style={{ marginTop: '1.5rem' }}>How It Works — DAE Hooks</h2>
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
      The DAE behavior is controlled by three hooks that run at different stages of the admin workflow.
    </p>

    <div style={sectionStyle}>
      <h3 style={{ marginTop: 0 }}>Filter Hook</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Runs when the admin opens the user list. Returns a Lucene query that limits which users are visible.
        A Fluidra admin sees users from both <code>fluidra-es</code> and <code>grepool-es</code>.
      </p>
    </div>

    <div style={sectionStyle}>
      <h3 style={{ marginTop: 0 }}>Settings Query</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Runs when the Create or Edit user form loads. Defines what custom fields appear — in this case
        a <strong>DAE Role</strong> dropdown, a <strong>Business Role</strong> dropdown, and custom <code>user_metadata</code> fields
        (<strong>Tier</strong>, <strong>Region</strong>, <strong>Preferred Language</strong>).
        The role options shown depend on which organization the logged-in admin belongs to.
      </p>
    </div>

    <div style={sectionStyle}>
      <h3 style={{ marginTop: 0 }}>Write Hook</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Runs when a user is created or updated. Maps the selected Business Role to an organization
        (e.g. <code>b2b_customer</code> → <code>fluidra-es</code>) and sets <code>app_metadata.organizations</code>
        on the user. On <strong>create</strong>, it sends an org invitation email via the Management API instead of
        setting a password directly. On <strong>update</strong>, it syncs Auth0 RBAC roles via the Management API.
      </p>
      <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        <strong>Flow when creating a user:</strong>
        <div style={{ ...credentialStyle, marginTop: '0.5rem' }}>
          Admin fills form → Settings Query builds the fields<br />
          Admin clicks Create → Write Hook runs<br />
          Business Role mapped to org → Management API called<br />
          Org invitation email sent to new user<br />
          User clicks link → sets password → joins organization
        </div>
      </div>
    </div>

    <hr style={dividerStyle} />

    {/* Test Accounts */}
    <h2 style={{ marginTop: '1.5rem' }}>Test Accounts</h2>

    <div style={sectionStyle}>
      <h3 style={{ marginTop: 0 }}>Fluidra Admin</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Full DAE access — can create and manage users across all Fluidra organizations.
      </p>
      <div style={credentialStyle}>
        <span style={{ color: '#a78bfa' }}>Username:</span> admin@fluidra.com<br />
        <span style={{ color: '#a78bfa' }}>Password:</span> Password123!<br />
        <span style={{ color: '#a78bfa' }}>Org:</span> fluidra-es · Role: admin
      </div>
    </div>

    <div style={sectionStyle}>
      <h3 style={{ marginTop: 0 }}>Grepool Admin</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        Scoped DAE admin — can only see and manage users within <code>grepool-es</code>.
        Use this to contrast with the Fluidra admin and show how the filter hook scopes access per organization.
      </p>
      <div style={credentialStyle}>
        <span style={{ color: '#a78bfa' }}>Username:</span> admin@grepool.com<br />
        <span style={{ color: '#a78bfa' }}>Password:</span> Password123!<br />
        <span style={{ color: '#a78bfa' }}>Org:</span> grepool-es · Role: Delegated Admin - Administrator
      </div>
    </div>
  </div>
);

export default DaeExtensionPage;
