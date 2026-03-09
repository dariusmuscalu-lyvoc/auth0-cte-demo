/**
 * DAE Filter Hook
 *
 * Runs when the admin opens the user list.
 * Returns a Lucene query that limits which users are visible.
 *
 * - Fluidra admin (fluidra-es): sees users from both fluidra-es and grepool-es
 * - Grepool admin (grepool-es): sees only grepool-es users
 */

function (ctx, callback) {
  var adminOrgs =
    ctx.request.user.app_metadata &&
    ctx.request.user.app_metadata.organizations;

  var adminOrg = Array.isArray(adminOrgs) && adminOrgs.length > 0
    ? adminOrgs[0]
    : null;

  if (adminOrg === "fluidra-es") {
    return callback(null, {
      query: 'app_metadata.organizations:"fluidra-es" OR app_metadata.organizations:"grepool-es"'
    });
  }

  if (adminOrg === "grepool-es") {
    return callback(null, {
      query: 'app_metadata.organizations:"grepool-es"'
    });
  }

  // No org — show nothing
  return callback(null, { query: 'app_metadata.organizations:"__none__"' });
}
