import express, { urlencoded, type Application, type Request, type Response } from "express";
import { Pool } from "pg";
const app: Application = express();
const port = 5000;

app.use(express.json());
app.use(express.text());
app.use(urlencoded({ extended: true }));

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_bVa61pKUDwuM@ep-blue-star-aqc32h9h.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require",
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
        message: "Express Learning",
        data: "express server"
    });
});

app.post("/", async (req: Request, res: Response) => {
    const { name, email, password, age } = req.body;

    try {
        const result = await pool.query(`
            INSERT INTO users(name, email, password, age) VALUES($1,$2,$3,$4)
            RETURNING *
        `, [name, email, password, age]);
        res.status(201).json({
            message: "User Created Successfully",
            data: result.rows[0]
        })
    } catch (error: any) {
        res.status(500).json({
            message: error.message,
            data: error
        })
    }
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
