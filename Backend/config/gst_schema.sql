CREATE TABLE company_gst_details (
    gst_id INT NOT NULL AUTO_INCREMENT,

    state VARCHAR(100) NOT NULL,
    gstin VARCHAR(20) NOT NULL UNIQUE,

    legal_name VARCHAR(200) NOT NULL,
    billing_address VARCHAR(500) NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (gst_id),

    INDEX idx_company_gst_state (state),
    INDEX idx_company_gst_active (is_active)
);