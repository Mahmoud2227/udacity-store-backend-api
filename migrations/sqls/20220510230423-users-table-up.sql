CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(100) Not NULL,
    lastName VARCHAR(100) Not NULL,
    userName VARCHAR(100) Not NULL,
    password VARCHAR Not NULL
);