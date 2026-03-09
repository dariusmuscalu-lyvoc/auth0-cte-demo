/**
 * DAE Write Hook
 *
 * CREATE: Sends an org invitation via Management API with app_metadata, user_metadata,
 *         and roles embedded. Returns an error to prevent DAE from also creating the
 *         user directly (which would cause a duplicate in a different connection).
 *         The invited user creates their account when they accept the invitation.
 *
 * UPDATE: Syncs Auth0 RBAC roles via Management API based on the selected
 *         DAE Role and Business Role.
 *
 * Org map:
 *   admin / b2b_customer → fluidra-es (org_RivztKsZ841qo1JG)
 *   buyer               → grepool-es  (org_xs1zrgSOKLxP48L1)
 */

function (ctx, callback) {

  var request = require("request");

  var AUTH0_DOMAIN       = "YOUR_AUTH0_DOMAIN";         // e.g. demo-lyvoc.eu.auth0.com
  var MGMT_CLIENT_ID     = "YOUR_MGMT_CLIENT_ID";       // M2M client ID
  var MGMT_CLIENT_SECRET = "YOUR_MGMT_CLIENT_SECRET";   // M2M client secret (rotate if exposed)
  var APP_CLIENT_ID      = "YOUR_APP_CLIENT_ID";        // SPA/app client ID for invitation link

  var appMeta = ctx.payload.app_metadata || {};

  var rawBusinessRole = appMeta.business_role;
  var rawDaeRole      = appMeta.dae_role;

  var businessRole =
    typeof rawBusinessRole === "object" ? rawBusinessRole.value : rawBusinessRole;
  var daeRole =
    typeof rawDaeRole === "object" ? rawDaeRole.value : rawDaeRole;

  var orgFromRole = null;
  if      (businessRole === "admin")        orgFromRole = "fluidra-es";
  else if (businessRole === "b2b_customer") orgFromRole = "fluidra-es";
  else if (businessRole === "buyer")        orgFromRole = "grepool-es";

  if (!orgFromRole) {
    var adminOrgs =
      ctx.request.user.app_metadata &&
      ctx.request.user.app_metadata.organizations;
    if (adminOrgs && adminOrgs.length > 0) orgFromRole = adminOrgs[0];
  }

  var orgIdMap = {
    "fluidra-es": "org_RivztKsZ841qo1JG",
    "grepool-es":  "org_xs1zrgSOKLxP48L1"
  };

  var businessRoleMap = {
    "admin":        "rol_QegkAl7LxkiaW0HP",
    "b2b_customer": "rol_squL3hOzse4wP4y1",
    "buyer":        "rol_8VSSgVX5rJSgv0ne"
  };

  var daeRoleMap = {
    "Delegated Admin - Administrator": "rol_5I2sslX9OZ0iil2O",
    "Delegated Admin - Auditor":       "rol_Lo2AvTn2eaOGyywy",
    "Delegated Admin - Operator":      "rol_nVrUmRqmvC0sqaN2",
    "Delegated Admin - User":          "rol_aoalck0xzb3ezhsr"
  };

  // =========================
  // CREATE → Send invitation only, no direct user creation
  // =========================

  if (ctx.method === "create") {

    var orgId = orgIdMap[orgFromRole];

    if (!orgId) {
      return callback(new Error("Unknown organization for business role: " + businessRole));
    }

    var rolesToAssign = [];
    if (businessRoleMap[businessRole]) rolesToAssign.push(businessRoleMap[businessRole]);
    if (daeRoleMap[daeRole])           rolesToAssign.push(daeRoleMap[daeRole]);

    request.post({
      url: "https://" + AUTH0_DOMAIN + "/oauth/token",
      json: {
        client_id:     MGMT_CLIENT_ID,
        client_secret: MGMT_CLIENT_SECRET,
        audience:      "https://" + AUTH0_DOMAIN + "/api/v2/",
        grant_type:    "client_credentials"
      }
    }, function (err, res, body) {

      if (err || !body || !body.access_token) {
        return callback(new Error("Could not obtain Management API token"));
      }

      var token = body.access_token;

      request.post({
        url:     "https://" + AUTH0_DOMAIN + "/api/v2/organizations/" + orgId + "/invitations",
        headers: { Authorization: "Bearer " + token },
        json: {
          inviter:      { name: ctx.request.user.name || "Admin" },
          invitee:      { email: ctx.payload.email },
          client_id:    APP_CLIENT_ID,
          app_metadata: {
            organizations: [orgFromRole],
            dae_role:      daeRole || null,
            business_role: businessRole || null
          },
          user_metadata: ctx.payload.user_metadata || {},
          roles:         rolesToAssign
        }
      }, function (err2, res2, body2) {

        if (err2) {
          return callback(new Error("Invitation request failed: " + err2.message));
        }

        if (body2 && body2.error) {
          return callback(new Error("Invitation error: " + body2.message));
        }

        // Returning an error prevents DAE from creating a duplicate user.
        // The invitation was sent — the user will receive an email to set up their account.
        return callback(new Error(
          "Invitation sent to " + ctx.payload.email + ". " +
          "The user will receive an email to complete registration and join " + orgFromRole + "."
        ));
      });
    });

    return;
  }

  // =========================
  // UPDATE → Sync RBAC roles
  // =========================

  if (ctx.method === "update") {

    var newUser = {
      email:         ctx.payload.email,
      connection:    ctx.payload.connection,
      user_metadata: ctx.payload.user_metadata,
      app_metadata: {
        organizations: orgFromRole ? [orgFromRole] : [],
        dae_role:      daeRole || null,
        business_role: businessRole || null
      }
    };

    if (!ctx.request.originalUser || !ctx.request.originalUser.user_id) {
      return callback(new Error("Cannot read user_id for update"));
    }

    var userId = ctx.request.originalUser.user_id;

    var allManagedRoles = [];
    for (var b in businessRoleMap) { allManagedRoles.push(businessRoleMap[b]); }
    for (var d in daeRoleMap)      { allManagedRoles.push(daeRoleMap[d]); }

    var newBusinessRoleId = businessRoleMap[businessRole];
    var newDaeRoleId      = daeRoleMap[daeRole];

    request.post({
      url: "https://" + AUTH0_DOMAIN + "/oauth/token",
      json: {
        client_id:     MGMT_CLIENT_ID,
        client_secret: MGMT_CLIENT_SECRET,
        audience:      "https://" + AUTH0_DOMAIN + "/api/v2/",
        grant_type:    "client_credentials"
      }
    }, function (err, res, body) {

      if (err || !body || !body.access_token) {
        return callback(new Error("Cannot get MGMT token"));
      }

      var token = body.access_token;

      request.get({
        url:     "https://" + AUTH0_DOMAIN + "/api/v2/users/" + encodeURIComponent(userId) + "/roles",
        headers: { Authorization: "Bearer " + token },
        json:    true
      }, function (err2, res2, existingRoles) {

        if (err2) { return callback(new Error("Cannot fetch roles")); }

        var rolesToRemove = [];
        for (var i = 0; i < existingRoles.length; i++) {
          if (allManagedRoles.indexOf(existingRoles[i].id) !== -1) {
            rolesToRemove.push(existingRoles[i].id);
          }
        }

        var removeOld = function (next) {
          if (rolesToRemove.length === 0) { return next(); }
          request.delete({
            url:     "https://" + AUTH0_DOMAIN + "/api/v2/users/" + encodeURIComponent(userId) + "/roles",
            headers: { Authorization: "Bearer " + token },
            json:    { roles: rolesToRemove }
          }, function () { next(); });
        };

        var addNew = function () {
          var rolesToAdd = [];
          if (newBusinessRoleId) rolesToAdd.push(newBusinessRoleId);
          if (newDaeRoleId)      rolesToAdd.push(newDaeRoleId);

          if (rolesToAdd.length === 0) { return callback(null, newUser); }

          request.post({
            url:     "https://" + AUTH0_DOMAIN + "/api/v2/users/" + encodeURIComponent(userId) + "/roles",
            headers: { Authorization: "Bearer " + token },
            json:    { roles: rolesToAdd }
          }, function () { return callback(null, newUser); });
        };

        removeOld(addNew);
      });
    });
  }
}
