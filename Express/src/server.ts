import express, { urlencoded, type Application, type Request, type Response } from "express";
import {Pool} from "pg";
const app: Application = express();
const port = 5000;

app.use(express.json());
app.use(express.text());
app.use(urlencoded({ extended: true }));

const pool = new Pool({
    connectionString : "postgresql://neondb_owner:npg_bVa61pKUDwuM@ep-blue-star-aqc32h9h.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require",
})

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Express Learning",
        data: "express server"
    });
});

app.post("/", (req: Request, res: Response) => {
    const { name, author, password } = req.body;
    res.status(201).json({
        message: "Created Successfully",
        data: {
            name,
            author
        }
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
