"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const database_1 = __importDefault(require("../database"));
class ProductModel {
    async index() {
        try {
            const conn = await database_1.default.connect();
            const sql = "SELECT * FROM products";
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        }
        catch (err) {
            throw new Error(`Could not get products. Error: ${err}`);
        }
    }
    async show(id) {
        try {
            const sql = "SELECT * FROM products WHERE id=($1)";
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find product ${id}. Error: ${err}`);
        }
    }
    async create(p) {
        try {
            const sql = "INSERT INTO products (name, category, price, description) VALUES($1, $2, $3, $4) RETURNING *";
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [p.name, p.category, p.price, p.description]);
            const product = result.rows[0];
            conn.release();
            return product;
        }
        catch (err) {
            throw new Error(`Could not add new Product. Error: ${err}`);
        }
    }
    async delete(id) {
        try {
            const sql = "DELETE FROM products WHERE id=($1) RETURNING *";
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            const product = result.rows[0];
            conn.release();
            return product;
        }
        catch (err) {
            throw new Error(`Could not delete Product ${id}. Error: ${err}`);
        }
    }
    async update(p) {
        try {
            const sql = "UPDATE products SET name=($1), category=($2), price=($3), description=($4) WHERE id=($5) RETURNING *";
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [
                p.name,
                p.category,
                p.price,
                p.description,
                p.id,
            ]);
            const product = result.rows[0];
            conn.release();
            return product;
        }
        catch (err) {
            throw new Error(`Could not update Product ${p.id}. Error: ${err}`);
        }
    }
}
exports.ProductModel = ProductModel;
