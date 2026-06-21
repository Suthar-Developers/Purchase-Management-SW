CREATE TABLE projects (
    project_id INT PRIMARY KEY UNIQUE KEY AUTO_INCREMENT,
    projectName VARCHAR(100),
    projectCode VARCHAR(50) NOT NULL UNIQUE KEY,
    clientName VARCHAR(100),
    projectAreaSqft INT,
    scopeOfWork VARCHAR(200),
    startDate DATE,
    endDate DATE,
    contactPersonName VARCHAR(100),
    contactPersonNumber VARCHAR(10),
    contactPersonEmail VARCHAR(100),
    budget VARCHAR(20),
    status ENUM("Planned", "Started", "Completed", "Hold"),
    state VARCHAR(100),
    city VARCHAR(100),
    address VARCHAR(200),
    description VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE vendors (
    vendor_id INT UNIQUE KEY AUTO_INCREMENT PRIMARY KEY,
    vendorName VARCHAR(100),
    vendorEmail VARCHAR(100),
    vendorContactNumber VARCHAR(10),
    vendorPortal VARCHAR(200),
    vendorType VARCHAR(50),
    vendorTag VARCHAR(50),
    pan VARCHAR(10),
    gst VARCHAR(15),
    status ENUM("Active", "Inactive", "Order Not Premitted", "Black Listed"),
    msme VARCHAR(12),
    accountHolderName VARCHAR(100),
    accountNumber VARCHAR(50),
    ifsc VARCHAR(11),
    bankName VARCHAR(100),
    location VARCHAR(200),
    panCardPhoto VARCHAR(200),
    gstCertificatePhoto VARCHAR(200),
    msmePhoto VARCHAR(200),
    bankDetailPhoto VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE purchase_request (
    request_id INT PRIMARY KEY NOT NULL UNIQUE KEY AUTO_INCREMENT,
    project_id INT,
    deliverBefore DATE,
    contactPerson VARCHAR(100),
    contactInfo VARCHAR(100),
    requestStatus ENUM("Approved", "Pending", "Partially Approved", "PO Drafted", "Rejected", "Requested") DEFAULT 'Requested',
    created_pr_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE materials (
    material_id INT PRIMARY KEY NOT NULL UNIQUE KEY AUTO_INCREMENT,
    request_id INT,
    material VARCHAR(200),
    specification VARCHAR(500),
    make VARCHAR(100),
    size VARCHAR(50),
    thickness VARCHAR(50),
    qty VARCHAR(50),
    unit VARCHAR(100),
    isNtItem VARCHAR(10),
    boqRef VARCHAR(100),
    scope VARCHAR(20),
    category VARCHAR(100),
    materialStatus ENUM("Approved", "Pending", "Rejected", 'Requested') DEFAULT 'Requested',
    created_m_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE purchase_orders (
    po_id INT AUTO_INCREMENT PRIMARY KEY,
    po_number VARCHAR(50) UNIQUE,
    
    vendor_id INT,
    project_id INT,

    order_date DATE,
    order_approved_date DATE,
    order_placed_by VARCHAR(100),

    billing_address TEXT,
    delivery_address TEXT,
    billing_gst VARCHAR(50),
    billing_contact_number VARCHAR(20),
    billing_contact_email VARCHAR(50),

    initiator VARCHAR(100),
    initiator_number VARCHAR(20),

    total_amount DECIMAL(12,2),
    total_discount DECIMAL(12,2),
    subtotal DECIMAL(12,2),
    taxable_amount DECIMAL(12,2),
    total_gst DECIMAL(12,2),
    grand_total DECIMAL(12,2),

    amount_in_words TEXT,

    prepared_by VARCHAR(100),
    checked_by VARCHAR(100),
    approved_by VARCHAR(100),

    po_status VARCHAR(50) DEFAULT 'Draft',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE purchase_order_items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    po_id INT,

    item_description VARCHAR(255),
    unit VARCHAR(50),
    qty DECIMAL(10,2),

    rate DECIMAL(10,2),
    discount_percent DECIMAL(5,2),
    gst_percent DECIMAL(5,2),

    amount DECIMAL(12,2),
    discount_amount DECIMAL(12,2),
    taxable_amount DECIMAL(12,2),
    gst_amount DECIMAL(12,2),
    total_amount DECIMAL(12,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (po_id) REFERENCES purchase_orders(po_id) ON DELETE CASCADE
);

CREATE TABLE purchase_order_extra_charges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    po_id INT,

    category VARCHAR(100),
    amount DECIMAL(10,2),
    gst_percent DECIMAL(5,2),
    gst_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (po_id) REFERENCES purchase_orders(po_id) ON DELETE CASCADE
);

ALTER TABLE purchase_request ADD CONSTRAINT fk_project FOREIGN KEY (project_id) REFERENCES projects(project_id);

ALTER TABLE purchase_orders ADD CONSTRAINT FOREIGN KEY (project_id) REFERENCES projects(project_id);
 
ALTER TABLE purchase_orders ADD CONSTRAINT FOREIGN KEY (vendor_id) REFERENCES vendors(vendor_id);

ALTER TABLE materials ADD CONSTRAINT fk_request FOREIGN KEY (request_id) REFERENCES purchase_request(request_id);