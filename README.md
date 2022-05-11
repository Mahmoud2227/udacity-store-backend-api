# Udacity: Build A Storefront Backend

This is a backend API build in Nodejs for an online store. It exposes a RESTful API that will be used by the frontend developer on the frontend.

The database schema and and API route information can be found in the [REQUIREMENT.md](REQUIREMENTS.md)

## Installation Instructions

This section contains all the packages used in this project and how to install them. However, you can fork this repo and run the following command at the root directory to install all packages.

`yarn` or `npm install`

### Packages

Here are some of the few packages that were installed.

#### express

`yarn add express`
`yarn add --dev @types/express`

#### typescript

`yarn add --dev typescript`

#### db-migrate

`npm install -g db-migrate`

#### bcrypt

`yarn add bcrypt`
`yarn add --dev @types/bcrypt`

#### jsonwebtoken

`yarn add jsonwebtoken`
`yarn add --dev @types/jsonwebtoken`

#### cross-env

`yarn add --dev cross-env`

#### jasmine

`yarn add --dev jasmine @types/jasmine @ert78gb/jasmine-ts ts-node`

## Set up Database

### Create Databases

We shall create the dev and test database.

-   connect to the default postgres database as the server's root user `psql -U postgres`
-   In psql run the following to create a user
    -   `CREATE USER shopping_user WITH PASSWORD 'password123';`
-   In psql run the following to create the dev and test database
    -   `CREATE DATABASE store_dev;`
    -   `CREATE DATABASE store_test;`
-   Connect to the databases and grant all privileges
    -   Grant for dev database
        -   `\c store_dev`
        -   `GRANT ALL PRIVILEGES ON DATABASE store_dev TO shopping_user;`
    -   Grant for test database
        -   `\c store_test`
        -   `GRANT ALL PRIVILEGES ON DATABASE store_test TO shopping_user;`

### Migrate Database

`db-migrate up`

## Enviromental Variables Set up

Bellow are the environmental variables that needs to be set in a `.env` file. This is the default setting that I used for development.

```
POSTGRES_HOST=127.0.0.1
POSTGRES_DB=store_dev
POSTGRES_TEST_DB=store_test
POSTGRES_USER=shopping_user
POSTGRES_PASSWORD=password123
BCRYPT_PASSWORD=ma#22$7h
SALT_ROUNDS=10
TOKEN_SECRET=mahm2154
TEST_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJmaXJzdG5hbWUiOiJKb2huIiwibGFzdG5hbWUiOiJEb2UiLCJ1c2VybmFtZSI6ImpvbjEyMyIsInBhc3N3b3JkIjoiJDJiJDEwJC9WUUVFaEVNOWVDRTMxTzJOSUZsb2UuL29CWUhNT2FGRDEzbXBZY242RUZFb1ZUdVdHUEJtIn0sImlhdCI6MTY1MjMwMTc0OX0.LyU3r249_NJS5MfEK46izt-z_-uP6dNZOVvGOgWQQgE
ENV=dev
```

## Start App

`yarn watch` or `npm run watch`

## Testing

Run test with

`yarn test`
