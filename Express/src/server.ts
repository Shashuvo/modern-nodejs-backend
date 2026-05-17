import express, { urlencoded, type Application, type Request, type Response } from "express";
import { Pool } from "pg";
import config from "./config";
const app: Application = express();
const port = config.port;

app.use(express.json());
app.use(express.text());
app.use(urlencoded({ extended: true }));

const pool = new Pool({
    connectionString: config.connection_string,
});

const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(20),
                email VARCHAR(20) UNIQUE NOT NULL,
                password VARCHAR(20) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                age SMALLINT,

                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
        console.log("Database connected successfully!!!");
    } catch (error) {
        console.log(error);
    }
}

initDB();

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Express Learning",
        data: "express server"
    });
});

// POST a user
app.post("/api/users", async (req: Request, res: Response) => {
    const { name, email, password, age } = req.body;

    try {
        const result = await pool.query(`
            INSERT INTO users(name, email, password, age) VALUES($1,$2,$3,$4)
            RETURNING *
        `, [name, email, password, age]);
        res.status(201).json({
            success: true,
            message: "User has been successfully posted!",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
})

// GET all users
app.get("/api/users", async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT * FROM users
        `);
        res.status(200).json({
            success: true,
            message: "Users has been successfully retrieved!",
            data: result.rows
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
})

// GET a single user
app.get("/api/users/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            SELECT * FROM users WHERE id = $1
        `, [id]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User Not Found!!",
                data: "NOT FOUND!"
            })
        }
        res.status(200).json({
            success: true,
            message: "User has been successfully retrieved!",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
})

// Update a user
app.put("/api/users/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, age, password, is_active } = req.body;
    try {
        const result = await pool.query(`
            UPDATE users SET name = COALESCE($1, name), age = COALESCE($2, age), password = COALESCE($3, password), is_active = COALESCE($4, is_active) WHERE id = $5 RETURNING *
        `, [name, age, password, is_active, id]);
        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User Not Found!!",
                data: "NOT FOUND!"
            })
        }
        res.status(200).json({
            success: true,
            message: "User has been successfully updated!",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
})

// DELEtE method
app.delete("/api/users/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
            DELETE FROM users WHERE id = $1
        `, [id]);
        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User Not Found!!",
                data: "NOT FOUND!"
            })
        }
        res.status(200).json({
            success: true,
            message: "User has been successfully deleted!",
            data: result.rows
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error
        })
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
