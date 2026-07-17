CREATE TABLE refresh_tokens (
    token_id INT AUTO_INCREMENT PRIMARY KEY,
    jti VARCHAR(64) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at DATETIME NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);