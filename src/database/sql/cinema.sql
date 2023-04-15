DROP TABLE IF EXISTS cinema;
CREATE TABLE cinema(
    cinema_id BIGSERIAL PRIMARY KEY,
    cinema_name VARCHAR NOT NULL,
    cinema_location VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);