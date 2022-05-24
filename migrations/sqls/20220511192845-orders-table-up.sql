CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    status VARCHAR(15) Not Null,
    user_id BIGINT REFERENCES users(id),
);