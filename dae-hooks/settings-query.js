/**
 * DAE Settings Query Hook
 *
 * Runs when the Create or Edit user form loads.
 * Defines what fields appear in the form.
 *
 * - DAE Role options are filtered by the logged-in admin's own role level
 * - Business Role options depend on the admin's organization
 * - user_metadata fields cover: identity, ERP data, Pro Academy, Pro Lab, Pro App
 */

function (ctx, callback) {

  const user = ctx.request.user || {};
  const appMeta = user.app_metadata || {};

  const roleHierarchy = {
    "Delegated Admin - Administrator": 4,
    "Delegated Admin - Operator": 3,
    "Delegated Admin - Auditor": 2,
    "Delegated Admin - User": 1
  };

  const currentAdminRole = appMeta.dae_role;
  const adminLevel = roleHierarchy[currentAdminRole] || 0;

  const adminOrgs = appMeta.organizations;

  if (!Array.isArray(adminOrgs) || adminOrgs.length === 0) {
    return callback(null, { userFields: [] });
  }

  const adminOrg = adminOrgs[0];

  const allRoles = [
    "Delegated Admin - User",
    "Delegated Admin - Auditor",
    "Delegated Admin - Operator",
    "Delegated Admin - Administrator"
  ];

  const daeRoleOptions = [
    { value: "", label: "No DAE Role" },
    ...allRoles
      .filter(r => roleHierarchy[r] <= adminLevel)
      .map(r => ({ value: r, label: r }))
  ];

  let businessOptions = [
    { value: "", label: "No Business Role" }
  ];

  if (adminOrg === "fluidra-es") {
    businessOptions.push(
      { value: "admin",        label: "Fluidra Admin" },
      { value: "b2b_customer", label: "Fluidra B2B Customer" },
      { value: "buyer",        label: "Grepool Buyer" }
    );
  } else if (adminOrg === "grepool-es") {
    businessOptions.push(
      { value: "buyer", label: "Grepool Buyer" }
    );
  }

  const languageOptions = [
    { value: "",   label: "Select language" },
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "it", label: "Italian" },
    { value: "pt", label: "Portuguese" },
    { value: "nl", label: "Dutch" },
    { value: "pl", label: "Polish" },
    { value: "cs", label: "Czech" },
    { value: "sv", label: "Swedish" },
    { value: "da", label: "Danish" },
    { value: "fi", label: "Finnish" },
    { value: "no", label: "Norwegian" },
    { value: "tr", label: "Turkish" },
    { value: "zh", label: "Chinese" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
    { value: "ar", label: "Arabic" },
    { value: "ru", label: "Russian" }
  ];

  const proAcademyOptions = [
    { value: "",         label: "Select access" },
    { value: "active",   label: "Active" },
    { value: "inactive", label: "Inactive" }
  ];

  return callback(null, {
    userFields: [
      // ── DAE / Auth0 fields ──────────────────────────────────────
      {
        property: "app_metadata.dae_role",
        label: "DAE Role",
        create: { type: "select", component: "InputSelectCombo", options: daeRoleOptions, required: false },
        edit:   { type: "select", component: "InputSelectCombo", options: daeRoleOptions, required: false }
      },
      {
        property: "app_metadata.business_role",
        label: "Business Role",
        create: { type: "select", component: "InputSelectCombo", options: businessOptions, required: false },
        edit:   { type: "select", component: "InputSelectCombo", options: businessOptions, required: false }
      },

      // ── Identity ────────────────────────────────────────────────
      {
        property: "user_metadata.first_name",
        label: "First Name",
        create: { type: "text", required: false },
        edit:   { type: "text", required: false }
      },
      {
        property: "user_metadata.last_name",
        label: "Last Name",
        create: { type: "text", required: false },
        edit:   { type: "text", required: false }
      },
      {
        property: "user_metadata.language",
        label: "Language",
        create: { type: "select", component: "InputSelectCombo", options: languageOptions, required: false },
        edit:   { type: "select", component: "InputSelectCombo", options: languageOptions, required: false }
      },

      // ── Organization / ERP ──────────────────────────────────────
      {
        property: "user_metadata.division",
        label: "Division",
        create: { type: "text", required: false },
        edit:   { type: "text", required: false }
      },
      {
        property: "user_metadata.country",
        label: "Country",
        create: { type: "text", required: false },
        edit:   { type: "text", required: false }
      },
      {
        property: "user_metadata.customer_id",
        label: "Customer ID (ERP)",
        create: { type: "text", required: false },
        edit:   { type: "text", required: false }
      },
      {
        property: "user_metadata.customer_account_name",
        label: "Customer Account Name (ERP)",
        create: { type: "text", required: false },
        edit:   { type: "text", required: false }
      },

      // ── Pro Academy ─────────────────────────────────────────────
      {
        property: "user_metadata.pro_academy_access",
        label: "Pro Academy Access",
        create: { type: "select", component: "InputSelectCombo", options: proAcademyOptions, required: false },
        edit:   { type: "select", component: "InputSelectCombo", options: proAcademyOptions, required: false }
      },

      // ── Pro Lab ─────────────────────────────────────────────────
      {
        property: "user_metadata.pro_lab_role",
        label: "Pro Lab Role",
        create: { type: "text", required: false },
        edit:   { type: "text", required: false }
      },

      // ── Pro App ─────────────────────────────────────────────────
      {
        property: "user_metadata.pro_app_role",
        label: "Pro App Role",
        create: { type: "text", required: false },
        edit:   { type: "text", required: false }
      }
    ]
  });
}
