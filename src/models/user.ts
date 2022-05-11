import client from "../database";
import bcrypt from "bcrypt";

export interface User {
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
}

export interface UserReturnType {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
}

const { BCRYPT_PASSWORD: pepper, SALT_ROUNDS: saltRounds } = process.env;

export class UserModel {
    async index(): Promise<UserReturnType[]> {
        try {
            const conn = await client.connect();
            const sql = "SELECT * FROM users";

            const result = await conn.query(sql);

            conn.release();

            return result.rows;
        } catch (err) {
            throw new Error(`Could not get users. Error: ${err}`);
        }
    }

    async show(id: number): Promise<UserReturnType> {
        try {
            const sql = "SELECT * FROM users WHERE id=($1)";

            const conn = await client.connect();

            const result = await conn.query(sql, [id]);

            conn.release();

            return result.rows[0];
        } catch (err) {
            throw new Error(`Could not find user ${id}. Error: ${err}`);
        }
    }

    async create(u: User): Promise<UserReturnType> {
        try {
            const sql =
                "INSERT INTO users (firstName, LastName, userName, password) VALUES($1, $2, $3, $4) RETURNING *";

            const conn = await client.connect();

            const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds as string));

            const result = await conn.query(sql, [u.firstName, u.lastName, u.userName, hash]);

            const user = result.rows[0];

            conn.release();

            return user;
        } catch (err) {
            throw new Error(`Could not add new User. Error: ${err}`);
        }
    }

    async delete(id: number): Promise<UserReturnType> {
        try {
            const sql = "DELETE FROM users WHERE id=($1)";

            const conn = await client.connect();

            const result = await conn.query(sql, [id]);

            const user = result.rows[0];

            conn.release();

            return user;
        } catch (err) {
            throw new Error(`Could not delete User ${id}. Error: ${err}`);
        }
    }

    async authenticate(username: string, password: string): Promise<UserReturnType | null> {
        const conn = await client.connect();
        const sql = "SELECT * FROM users WHERE userName=($1)";

        const result = await conn.query(sql, [username]);

        console.log(password + pepper);

        if (result.rows.length) {
            const user = result.rows[0];

            console.log(user);

            if (bcrypt.compareSync(password + pepper, user.password)) {
                return user;
            }
        }

        return null;
    }
}
