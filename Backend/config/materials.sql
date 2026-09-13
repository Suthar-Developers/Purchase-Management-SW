CREATE TABLE materials_list (
    material_id INT PRIMARY KEY NOT NULL UNIQUE KEY AUTO_INCREMENT,
    material_name VARCHAR(200),
    material_code VARCHAR(100),
    material_category VARCHAR(100),
    material_status ENUM("Active", "Inactive") DEFAULT 'Active',
    created_material_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE category_list (
    material_category_id INT PRIMARY KEY NOT NULL UNIQUE KEY AUTO_INCREMENT,
    material_category VARCHAR(200),
    created_category_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE unit_list (
    material_unit_id INT PRIMARY KEY NOT NULL UNIQUE KEY AUTO_INCREMENT,
    material_unit VARCHAR(200),
    created_unit_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);