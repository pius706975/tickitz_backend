DROP TABLE IF EXISTS bookng;
CREATE TABLE bookng (
    bookng_id BIGSERIAL PRIMARY KEY,
    seat INT [] NOT NULL,
    booking_date TIMESTAMP NOT NULL,
    total INT DEFAULT 0,
    schedule_id INT,
    user_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    CONSTRAINT fk_schedule FOREIGN KEY(schedule_id) REFERENCES schedules(schedule_id),
    CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(user_id)
);