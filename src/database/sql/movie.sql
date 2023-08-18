DROP TABLE IF EXISTS movies;
CREATE TABLE movies (
    movie_id BIGSERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    release_date DATE NOT NULL,
    directed_by VARCHAR NOT NULL,
    duration VARCHAR,
    casts VARCHAR,
    genre VARCHAR,
    synopsis VARCHAR,
    images VARCHAR,
    user_id INT, 
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    CONSTRAINT fk_users FOREIGN KEY (user_id) REFERENCES users(user_id)
);