CREATE TABLE products (
    id SERIAL PRIMARY  KEY ,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    price integer NOT NULL,
    description Text 
);