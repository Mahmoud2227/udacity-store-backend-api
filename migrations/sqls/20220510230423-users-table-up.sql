CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    userName VARCHAR(100) Not NULL,
    password VARCHAR Not NULL
);