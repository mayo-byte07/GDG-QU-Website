import { Router } from "express";
import {
    githubOAuth,
    googleOAuth,
    logout,
} from "../controllers/auth.controller";
import { body, query } from "express-validator";

const authRouter = Router();

authRouter.post(
    "/google",
    body("code").notEmpty().withMessage("code is required"),
    googleOAuth
);
authRouter.get(
    "/github",
    query("code").notEmpty().withMessage("Code is required"),
    githubOAuth
);
authRouter.post(
    "/logout",
    (req, res, next) => next(),
    logout
);

export default authRouter;
