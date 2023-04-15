DROP TABLE IF EXISTS schedules CASCADE;
CREATE TABLE schedules (
    schedule_id BIGSERIAL PRIMARY KEY,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    cinema_id INT,
    movie_id INT, 
    user_id INT,
    price INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    CONSTRAINT fk_cinema FOREIGN KEY(cinema_id) REFERENCES cinema(cinema_id),
    CONSTRAINT fk_movie FOREIGN KEY(movie_id) REFERENCES movies(movie_id),
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(user_id)
);