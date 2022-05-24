CREATE TABLE orders_products (
    id SERIAL PRIMARY KEY,
    quantity INT,
    order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id)
);