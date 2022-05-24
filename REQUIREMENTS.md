# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

-   Index: `'products/' [GET]`
-   Show: `'products/:id' [GET]`
-   Create (args: Product) [token required]: `'products/' [POST] (token)`
-   Delete (args: id) [token required]: `'products [DELETE] (token)`
-   Update (args: Product) [token required]: `'products/ [PUT] (token)`

#### Users

-   Index: `'users/' [GET]`
-   Show: `'users/:id' [GET]`
-   Create (args: User) [token required]: `'users/' [POST] (token)`
-   Delete (args: id) [token required]: `'users/' [DELETE] (token)`
-   Update (args: User) [token required]: `'users/' [PUT] (token)`

#### Orders

-   Index [token required] : `'orders/' [GET](token)`
-   Show Order by id [token required] : `'orders/:id' [GET](token)`
-   Create Order (args: Order) [token required] : `'orders/' [POST](token)`
-   Delete Order (args: id) [token required]: `'orders/' [DELETE](token)`
-   Update Order (args: Order) [token required]: `'orders/' [PUT](token)`
-   Add product to the order (args: quantity,order_id,product_id) [token required] : `"/orders/:id/products [PUT](token)`

## Data Shapes

#### Products

| Data        | Data Types   | Constraints |
| ----------- | ------------ | ----------- |
| id          | SERIAL       | PRIMARY KEY |
| name        | VARCHAR(100) | NOT NULL    |
| category    | VARCHAR(100) |             |
| price       | INT          | NOT NULL    |
| description | Text         |             |

#### Users

| Data      | Data Types   | Constraints |
| --------- | ------------ | ----------- |
| id        | SERIAL       | PRIMARY KEY |
| firstName | VARCHAR(100) | NOT NULL    |
| lastName  | VARCHAR(100) | NOT NULL    |
| userName  | VARCHAR(100) | NOT NULL    |
| password  | VARCHAR      | NOT NULL    |

#### Orders

| Data    | Data Types  | Constraints          |
| ------- | ----------- | -------------------- |
| id      | SERIAL      | PRIMARY KEY          |
| status  | VARCHAR(15) | NOT NULL             |
| user_id | INT         | REFERENCES users(id) |

#### Orders_products Table

| Data       | Data Types | Constraints             |
| ---------- | ---------- | ----------------------- |
| id         | SERIAL     | PRIMARY KEY             |
| quantity   | INT        |                         |
| order_id   | bigint     | REFERENCES orders(id)   |
| product_id | bigint     | REFERENCES products(id) |
