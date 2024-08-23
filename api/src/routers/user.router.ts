import e, { Request, Response } from "express";
import AuthController from "../controllers/AuthController";
import authenticateUser from "../middleware/authenticateUser";
import { User } from "../types";
import { parseUserForResponse } from "../utils";
import pokemonRouter from "./pokemon.router";

const userRouter = e.Router();

type AuthenticatedRequest = Request & {
    user: User;
};

// Nested router for pokemon endpoints
userRouter.use("/pokemon", pokemonRouter);
userRouter.post("/signup", AuthController.signUp);
userRouter.post("/login", AuthController.signIn);

// Sorry if you have OCD
userRouter.get(
    "/@me",
    authenticateUser,
    async (req: Request, res: Response) => {
        res.json(
            await parseUserForResponse((req as AuthenticatedRequest).user)
        );
    }
);

export default userRouter;
