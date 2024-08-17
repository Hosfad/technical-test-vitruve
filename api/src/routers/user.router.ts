import e, { Request, Response } from "express";
import authenticateUser from "../middleware/authenticateUser";
import { PokemonData, User } from "../types";
import { getUserInfo, saveUser } from "../utils";
import { readFileSync } from "fs";

const userRouter = e.Router();

type AuthenticatedRequest = Request & {
    user: User;
};

userRouter.get(
    "/@me",
    authenticateUser,
    async (req: Request, res: Response) => {
        const authenticatedReq = req as AuthenticatedRequest;

        res.json(authenticatedReq.user);
    }
);

userRouter.get(
    "/@me/favorite/:pokemon",
    authenticateUser,
    async (req: Request, res: Response) => {
        const authenticatedReq = req as AuthenticatedRequest;
        const { pokemon } = req.params;
        const user = authenticatedReq.user;

        const includes = user.favorites.find((p) => p.name === pokemon);
        const searchIndex = readFileSync("./data/search-index.json");
        const index = JSON.parse(searchIndex.toString());
        console.log(pokemon);
        const desiredPokemon = index.find(
            (p: PokemonData) => p.name === pokemon
        );
        if (!desiredPokemon) {
            return res.status(404).json({ error: "Pokemon not found" });
        }

        if (!includes) {
            user.favorites.push(desiredPokemon);
        } else {
            user.favorites = user.favorites.filter((p) => p.name !== pokemon);
        }

        saveUser(user);
        res.json(user);
    }
);

userRouter.post("/signup", async (req: Request, res: Response) => {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const exists = getUserInfo(email);
    if (exists) {
        return res.status(400).json({ error: "User already exists" });
    }

    const accessToken = Math.random().toString(36) + Math.random().toString(36);

    // In a real world we would hash the password before saving it but for the sake of this test we are gonna save it as is :P
    // we will also have an expiration date for the accessToken but for this test thats not needed.
    const user: User = {
        email,
        password,
        username,
        favorites: [],
        accessToken,
    };

    saveUser(user);
    res.json(user);
});

userRouter.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const user = getUserInfo(email);
    console.log(user);
    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    saveUser(user);
    res.json(user);
});

export default userRouter;
