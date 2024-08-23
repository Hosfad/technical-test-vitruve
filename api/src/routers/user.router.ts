import e, { Request, Response } from "express";
import authenticateUser from "../middleware/authenticateUser";
import { User } from "../types";
import { getError, getUserInfo, parseUserForResponse } from "../utils";
import pokemonRouter from "./pokemon.router";

const userRouter = e.Router();

type AuthenticatedRequest = Request & {
    user: User;
};

// Apply authenticateUser on all enpoints of the pokemonRouter
userRouter.use("/pokemon", authenticateUser, pokemonRouter);

userRouter.get(
    "/@me",
    authenticateUser,
    async (req: Request, res: Response) => {
        const authenticatedReq = req as AuthenticatedRequest;
        res.json(await parseUserForResponse(authenticatedReq.user));
    }
);

userRouter.post("/signup", async (req: Request, res: Response) => {
    const { email, password, username } = req.body;

    const badRequest = getError(res, 404);
    if (!email || !password || !username) {
        return badRequest("Missing required fields");
    }

    const exists = await getUserInfo(email);
    if (exists) {
        return badRequest("User already exists");
    }

    const accessToken = Math.random().toString(36) + Math.random().toString(36);

    // In a real world we would hash the password before saving it but for the sake of this test we are gonna save it as is :P
    // we will also have an expiration date for the accessToken but for this test thats not needed.
    const user: User = {
        email,
        password,
        username,
        favorites: [],
        customPokemon: [],
        accessToken,
    };

    res.json(await parseUserForResponse(user));
});

userRouter.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return getError(res, 400)("Missing required fields");
    }

    const user = await getUserInfo(email);
    if (!user || user.password !== password) {
        return getError(res, 401)("Invalid email or password");
    }

    res.json(await parseUserForResponse(user));
});

export default userRouter;
