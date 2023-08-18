'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface) {
        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id BIGSERIAL PRIMARY KEY NOT NULL,
                username VARCHAR NOT NULL,
                email VARCHAR NOT NULL,
                password VARCHAR NOT NULL,
                image VARCHAR,
                role INTEGER DEFAULT 0,
                is_verified BOOLEAN DEFAULT FALSE,
                refresh_token VARCHAR,
                token_verify VARCHAR,
                token_expire TIMESTAMP,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `)

        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS movies (
                movie_id BIGSERIAL PRIMARY KEY,
                title VARCHAR NOT NULL,
                release_date DATE NOT NULL,
                directed_by VARCHAR NOT NULL,
                duration VARCHAR,
                casts VARCHAR,
                genre VARCHAR,
                synopsis VARCHAR,
                image VARCHAR,
                user_id INT, 
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                CONSTRAINT fk_users 
                    FOREIGN KEY (user_id) 
                    REFERENCES users(user_id)
            )
        `)

        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS cinema(
                cinema_id BIGSERIAL PRIMARY KEY,
                cinema_name VARCHAR NOT NULL,
                cinema_location VARCHAR NOT NULL,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `)

        await queryInterface.sequelize.query(`
            CREATE TABLE IF NOT EXISTS schedules (
                schedule_id BIGSERIAL PRIMARY KEY,
                start_date TIMESTAMP NOT NULL,
                end_date TIMESTAMP NOT NULL,
                cinema_id INT,
                movie_id INT, 
                user_id INT,
                price INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                CONSTRAINT fk_cinema 
                    FOREIGN KEY(cinema_id) 
                    REFERENCES cinema(cinema_id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_movie 
                    FOREIGN KEY(movie_id) 
                    REFERENCES movies(movie_id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_user 
                    FOREIGN KEY(user_id) 
                    REFERENCES users(user_id)
                    ON DELETE CASCADE
            );
        `)

        await queryInterface.sequelize.query(`
            CREATE TABLE booking (
                bookng_id BIGSERIAL PRIMARY KEY,
                seat INT [] NOT NULL,
                booking_date TIMESTAMP NOT NULL,
                total INT DEFAULT 0,
                schedule_id INT,
                user_id INT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                CONSTRAINT fk_schedule 
                    FOREIGN KEY(schedule_id) 
                    REFERENCES schedules(schedule_id)
                    ON DELETE CASCADE,
                CONSTRAINT fk_users 
                    FOREIGN KEY(user_id) 
                    REFERENCES users(user_id)
                    ON DELETE CASCADE
            )
        `)
    },

    async down (queryInterface) {
        await queryInterface.sequelize.query(`DROP TABLE IF EXISTS booking`)
        await queryInterface.sequelize.query(`DROP TABLE IF EXISTS schedules`)
        await queryInterface.sequelize.query(`DROP TABLE IF EXISTS cinema`)
        await queryInterface.sequelize.query(`DROP TABLE IF EXISTS movies`)
        await queryInterface.sequelize.query(`DROP TABLE IF EXISTS users`)
        
    }
}