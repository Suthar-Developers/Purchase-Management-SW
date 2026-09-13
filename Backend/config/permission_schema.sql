CREATE TABLE IF NOT EXISTS user_permissions (
permission_id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
module_key VARCHAR(100) NOT NULL,
action_key VARCHAR(50) NOT NULL,
can_access TINYINT(1) NOT NULL DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
UNIQUE KEY unique_user_permission (user_id, module_key, action_key),
CONSTRAINT fk_user_permissions_user
    FOREIGN KEY (user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS role_permissions (
permission_id INT AUTO_INCREMENT PRIMARY KEY,
role_name VARCHAR(100) NOT NULL,
module_key VARCHAR(100) NOT NULL,
action_key VARCHAR(50) NOT NULL,
can_access TINYINT(1) NOT NULL DEFAULT 0,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
UNIQUE KEY unique_role_permission (role_name, module_key, action_key)
);
