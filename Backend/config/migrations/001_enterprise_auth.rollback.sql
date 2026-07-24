-- Only use after restoring application code that predates migration 001.
DROP TABLE IF EXISTS audit_logs, security_events, password_history, login_attempts, field_policies, data_scope_policies, user_memberships, user_project_assignments, user_permissions, role_permissions, permissions, permission_groups, modules, role_inheritance, sessions, roles, sites, departments, branches, companies;
ALTER TABLE refresh_tokens DROP COLUMN session_id, DROP COLUMN token_family_id, DROP COLUMN replaced_by_jti, DROP COLUMN last_used_at;
ALTER TABLE users DROP COLUMN role_ref_id, DROP COLUMN company_id, DROP COLUMN branch_id, DROP COLUMN department_id, DROP COLUMN manager_user_id, DROP COLUMN password_changed_at, DROP COLUMN force_password_change, DROP COLUMN deleted_at, DROP COLUMN permission_version;
