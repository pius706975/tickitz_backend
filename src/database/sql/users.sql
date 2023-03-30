DROP TABLE IF EXISTS users;
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY NOT NULL,
    username VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    image VARCHAR,
    role INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    token_verify VARCHAR,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
);