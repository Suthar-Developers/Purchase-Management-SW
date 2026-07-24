const db = require('../config/db');
const SCOPE_COLUMN = { project: 'project_id', vendor: 'vendor_id', purchase_request: 'request_id', purchase_order: 'po_id' };
const enforceDataScope = (moduleKey, table, idColumn) => async (req, res, next) => {
  try {
    const [policies] = await db.query(`SELECT scope FROM data_scope_policies WHERE (subject_type='user' AND subject_id=?) OR (subject_type='role' AND subject_id=?) ORDER BY subject_type='user' DESC`, [req.user.user_id, req.user.role_ref_id]);
    const scope = policies.find(Boolean)?.scope || 'own';
    req.dataScope = { moduleKey, table, idColumn: idColumn || SCOPE_COLUMN[moduleKey], scope };
    next();
  } catch (error) { next(error); }
};
module.exports = { enforceDataScope };
