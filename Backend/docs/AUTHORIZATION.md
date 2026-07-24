# Adding a module or permission

1. Insert the module and its action permissions through a versioned migration. Permission keys are stable `module.action` values.
2. Protect each backend endpoint with `authenticate`, `csrfProtection` for unsafe methods, and `requirePermission('module.action')`.
3. Add the matching frontend `useCan('module.action')`, `<Can>`, or `<PermissionRoute>` guard. UI guards are convenience only; the API middleware is authoritative.
4. For record visibility, add a `data_scope_policies` row and apply the module's scope predicate in its repository query. For a field, add a `field_policies` row; `hidden` overrides `readonly`, which overrides `editable`.
5. Permission, role, assignment, and user-override edits must increment affected users' `permission_version`, invalidate the permission cache, and write an audit event.

Run `config/migrations/001_enterprise_auth.sql` only after a backup and in a maintenance window. The matching rollback is for code rollback only; restore a database backup for production data recovery.
