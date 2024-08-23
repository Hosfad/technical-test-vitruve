import e, { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import authenticateUser from "../middleware/authenticateUser";
import { User } from "../types";
import {
    getError,
    getUserInfo,
    hashPassword,
    parseUserForResponse,
} from "../utils";
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

    const accessToken = uuidv4();
    const salt = uuidv4();

    // In a real world we would have an expiration date for the accessToken but for this test thats not needed.
    const user: User = {
        email,
        password: await hashPassword(password, salt),
        username,
        favorites: [],
        customPokemon: [],
        accessToken,
        salt,
    };

    res.json(await parseUserForResponse(user));
});

userRouter.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return getError(res, 400)("Missing required fields");
    }
    const notAuthorized = getError(res, 401);

    const user = await getUserInfo(email);
    if (!user) return notAuthorized("User not found");

    const hashedPassword = await hashPassword(password, user.salt!);

    if (user.password !== hashedPassword) {
        return notAuthorized("Incorrect password");
    }

    res.json(await parseUserForResponse(user));
});

export default userRouter;
