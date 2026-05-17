import express, { urlencoded, type Application, type Request, type Response } from "express";
import { pool } from "./db";
import { userRouter } from "./modules/user/user.route";
const app: Application = express();

app.use(express.json());
app.use(express.text());
app.use(urlencoded({ extended: true }));


app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Express Learning",
        data: "express server"
    });
});

app.use("/api/users", userRouter);


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


export default app;
