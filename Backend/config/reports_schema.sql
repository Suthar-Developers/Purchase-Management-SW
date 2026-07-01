CREATE TABLE IF NOT EXISTS report_saved_filters (
    filter_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    name VARCHAR(120) NOT NULL,
    report_id VARCHAR(80),
    visibility ENUM('private', 'shared') DEFAULT 'private',
    filters JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_report_saved_filters_user (user_id),
    INDEX idx_report_saved_filters_report (report_id)
);

CREATE TABLE IF NOT EXISTS report_templates (
    template_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    name VARCHAR(120) NOT NULL,
    report_id VARCHAR(80) NOT NULL,
    columns JSON NOT NULL,
    filters JSON,
    grouping JSON,
    aggregations JSON,
    visibility ENUM('private', 'shared') DEFAULT 'private',
    version INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_report_templates_user (user_id),
    INDEX idx_report_templates_report (report_id)
);

CREATE TABLE IF NOT EXISTS report_schedules (
    schedule_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    report_id VARCHAR(80) NOT NULL,
    name VARCHAR(120) NOT NULL,
    frequency ENUM('daily', 'weekly', 'monthly', 'quarterly') NOT NULL,
    recipients JSON NOT NULL,
    export_format ENUM('pdf', 'excel', 'csv') DEFAULT 'pdf',
    filters JSON,
    is_active TINYINT(1) DEFAULT 1,
    next_run_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_report_schedules_next_run (is_active, next_run_at),
    INDEX idx_report_schedules_user (user_id)
);

CREATE TABLE IF NOT EXISTS report_favorites (
    favorite_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    report_id VARCHAR(80) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_report_favorite_user_report (user_id, report_id),
    INDEX idx_report_favorites_user (user_id)
);

CREATE TABLE IF NOT EXISTS report_audit_logs (
    audit_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    action VARCHAR(80) NOT NULL,
    report_id VARCHAR(80),
    metadata JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_report_audit_user_created (user_id, created_at),
    INDEX idx_report_audit_report_created (report_id, created_at)
);

CREATE TABLE IF NOT EXISTS report_threshold_alerts (
    alert_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    report_id VARCHAR(80) NOT NULL,
    name VARCHAR(120) NOT NULL,
    metric VARCHAR(80) NOT NULL,
    operator ENUM('>', '>=', '<', '<=', '=') NOT NULL,
    threshold_value DECIMAL(18,2) NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    recipients JSON,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_report_alerts_user (user_id),
    INDEX idx_report_alerts_report_metric (report_id, metric)
);

CREATE INDEX idx_po_report_date_status ON purchase_orders (order_date, po_status);
CREATE INDEX idx_po_report_project_vendor ON purchase_orders (project_id, vendor_id);
CREATE INDEX idx_po_report_totals ON purchase_orders (grand_total, total_discount, total_gst);
CREATE INDEX idx_po_items_report_item ON purchase_order_items (item_description, gst_percent);
CREATE INDEX idx_po_items_report_rate_qty ON purchase_order_items (rate, qty);
CREATE INDEX idx_pr_report_status_date ON purchase_request (requestStatus, created_pr_at);
CREATE INDEX idx_projects_report_location ON projects (state, city);
CREATE INDEX idx_vendors_report_status ON vendors (status);

CREATE OR REPLACE VIEW vw_purchase_report_fact AS
SELECT
    po.po_id,
    po.po_number,
    po.po_status,
    po.order_date,
    po.order_approved_date,
    po.created_at,
    po.project_id,
    p.projectName,
    p.city,
    p.state,
    p.budget,
    po.vendor_id,
    v.vendorName,
    v.status vendor_status,
    poi.item_id,
    poi.item_description,
    poi.unit,
    poi.qty,
    poi.rate,
    poi.discount_percent,
    poi.gst_percent,
    poi.amount,
    poi.discount_amount,
    poi.gst_amount,
    poi.total_amount item_total,
    po.total_amount,
    po.total_discount,
    po.total_gst,
    po.grand_total
FROM purchase_orders po
LEFT JOIN purchase_order_items poi ON po.po_id = poi.po_id
LEFT JOIN projects p ON po.project_id = p.project_id
LEFT JOIN vendors v ON po.vendor_id = v.vendor_id;
