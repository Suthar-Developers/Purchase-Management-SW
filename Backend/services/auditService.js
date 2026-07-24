const db = require('../config/db');
const { clientIp } = require('../utils/security');
const audit = async (req, action, options = {}) => db.query(
  `INSERT INTO audit_logs (user_id,action,module_key,entity_type,entity_id,ip_address,user_agent,old_value,new_value,request_id) VALUES (?,?,?,?,?,?,?,?,?,?)`,
  [req.user?.user_id || null, action, options.moduleKey || null, options.entityType || null, options.entityId || null, clientIp(req), req.get('user-agent') || null, options.oldValue ? JSON.stringify(options.oldValue) : null, options.newValue ? JSON.stringify(options.newValue) : null, req.requestId || null]
);
module.exports = { audit };
