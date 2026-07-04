import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import config from "./config";


import { userRouter } from "./modules/users/user.routes";
import { authRouter } from "./modules/auth/auth.route";
import { postRoute } from "./modules/posts/post.route";
import { comentRoute } from "./modules/coments/coment.route";
import { notFound } from "./middleware/notfound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { subscriptionRoute } from "./modules/subscription/subscription.route";

const app: Application = express();
app.use(cors({
    origin: config.app_url,
    credentials: true,
}))

app.use("/api/subscription/webhooks",express.raw({type: 'application/json'}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.send("I am going")

})

app.use("/api/user",userRouter);

app.use("/api/auth",authRouter);
app.use("/api/posts",postRoute);
app.use("/api/coments",comentRoute);
app.use("/api/subscription",subscriptionRoute);
// route not found error handler middleware
app.use(notFound);
// global error handler
app.use(globalErrorHandler);

export default app;