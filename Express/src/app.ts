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

export default app;
