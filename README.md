# Tickitz Backend Node.JS
Tickitz is an online app that allows people to order cinema tickets according the chosen location such as city and cinema.

##
## Application installation steps
Install npm dependencies in the main folder that contain "package.json" to make sure the installation works properly. 
``` bash
    npm install
```

Example of environtment variables.
``` bash
    APP_PORT=8081
    BASE_URL=http://localhost:8081

    # it's up to you what jwt_secret or refresh_token_refresh you want to use. e.g you can use "thisissecrect".
    JWT_SECRET=thisissecret

    DB_HOST=localhost
    DB_NAME=database_name
    DB_USER=xxxxx
    DB_PASSWORD=xxxxx
    DB_PORT=database_port

    # you can use your own gmail as mail user and get the application password from gmail to fill mail_pass. 
    MAIL_USER=
    MAIL_PASS=

    # You need to create cloudinary account first to get name, api_key, and api_secret
    CLOUDINARY_NAME=
    CLOUDINARY_KEY=
    CLOUDINARY_SECRET=

    # You can upload default picture in cloudinary first and get the link that will be used as default user picture and default product picture.
    DEFAULT_PICTURE=
    DEFAULT_MOVIE_IMAGE=
```

##
## How to run this applications?
Before execute database migration, check "config.json" in "src/database/config".
``` bash
    # RE-configure according your db configuration values
    {
        "development": {
        "username": "",
        "password": "",
        "database": "",
        "host": "",
        "dialect": ""
        },
        "test": {
        "username": "",
        "password": "",
        "database": "",
        "host": "",
        "dialect": ""
        },
        "production": {
        "username": "",
        "password": "",
        "database": "",
        "host": "",
        "dialect": ""
        }
    }
```

Create new database and run database migration.
``` bash
    # to create all tables
    npm run migrate:up

    # to drop all tables
    npm run migrate:down
```

Start the server
``` bash
    npm start

    # or

    npm run dev
```

##
## Postman documentation
``` bash
    https://documenter.getpostman.com/view/26304983/2s9Y5SW5i7
```