import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import config from "./config";

import { userRouter } from "./modules/users/user.routes";
import { authRouter } from "./modules/auth/auth.route";

const app: Application = express();
app.use(cors({
    origin: config.app_url,
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.send("I am going")

})

app.use("/api/user",userRouter);

app.use("/api/auth",authRouter);

export default app;