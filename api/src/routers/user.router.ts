import e, { Request, Response } from "express";
import { readFileSync } from "fs";
import authenticateUser from "../middleware/authenticateUser";
import { Pokemon, PokemonData, User } from "../types";
import { getError, getUserInfo, saveUser } from "../utils";

const userRouter = e.Router();

type AuthenticatedRequest = Request & {
    user: User;
};

const parseUserForResponse = async (user: User) => {
    await saveUser(user);
    //@ts-ignore
    delete user.password;
    return user;
};

userRouter.get(
    "/@me",
    authenticateUser,
    async (req: Request, res: Response) => {
        const authenticatedReq = req as AuthenticatedRequest;
        res.json(await parseUserForResponse(authenticatedReq.user));
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
        const desiredPokemon = index.find(
            (p: PokemonData) => p.name === pokemon
        );
        const notFound = getError(res, 404);
        if (!desiredPokemon) {
            return notFound("Pokemon not found");
        }

        if (!includes) {
            user.favorites.push(desiredPokemon);
        } else {
            user.favorites = user.favorites.filter((p) => p.name !== pokemon);
        }
        res.json(await parseUserForResponse(user));
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

userRouter.put(
    "/pokemon",
    authenticateUser,
    async (req: Request, res: Response) => {
        const authenticatedReq = req as AuthenticatedRequest;
        const data = req.body as {
            height: number;
            weight: number;
            name: string;
            types: string;
            image: string;
        };
        if (
            !data.height ||
            !data.weight ||
            !data.name ||
            !data.types ||
            !data.image
        ) {
            return getError(res, 400)("Missing required fields");
        }

        const user = authenticatedReq.user;

        const pokemon: Pokemon = {
            id: Date.now(),
            isCustomPokemon: true,
            height: data.height,
            weight: data.weight,
            name: data.name,
            sprites: {
                front_default: data.image,
            },
            types: [
                {
                    type: {
                        name: data.types,
                        url: "",
                    },
                },
            ],
        };
        user.customPokemon.push(pokemon);
        res.json({ user: await parseUserForResponse(user), pokemon: pokemon });
    }
);

userRouter.delete(
    "/pokemon/:id",
    authenticateUser,
    async (req: Request, res: Response) => {
        const authenticatedReq = req as AuthenticatedRequest;
        const { id } = req.params;
        const user = authenticatedReq.user;
        if (!user.customPokemon) user.customPokemon = [];
        user.customPokemon = user.customPokemon.filter(
            (p) => p.id !== parseInt(id)
        );

        res.json(await parseUserForResponse(user));
    }
);

userRouter.post(
    "/pokemon/:id",
    authenticateUser,
    async (req: Request, res: Response) => {
        const authenticatedReq = req as AuthenticatedRequest;
        const { id } = req.params;

        const user = authenticatedReq.user;
        const pokemon = user.customPokemon.find((p) => p.id === parseInt(id));
        if (!pokemon) {
            return getError(res, 404)("Pokemon not found");
        }

        const newData = req.body as {
            height: number | null;
            weight: number | null;
            name: string | null;
            types: string | null;
            image: string | null;
        };

        if (newData.height) {
            pokemon.height = newData.height;
        }
        if (newData.weight) {
            pokemon.weight = newData.weight;
        }
        if (newData.name) {
            pokemon.name = newData.name;
        }
        if (newData.types) {
            pokemon.types = [
                {
                    type: {
                        name: newData.types,
                        url: "",
                    },
                },
            ];
        }
        if (newData.image) {
            pokemon.sprites.front_default = newData.image;
        }

        res.json({ user: await parseUserForResponse(user), pokemon: pokemon });
    }
);
export default userRouter;
