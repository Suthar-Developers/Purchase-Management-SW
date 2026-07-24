// Compatibility export: route code must pass permission keys, never role names.
const { requirePermission, requireModule } = require('./requirePermission');
module.exports = requirePermission;
module.exports.requirePermission = requirePermission;
module.exports.requireModule = requireModule;
