import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { readFile } from "fs/promises";
import userRouter from "./routers/user.router";
import { Pokemon } from "./types";
import { getError, getUserThroughToken } from "./utils";
dotenv.config();

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Authorization", "Content-Type"],
        maxAge: 86400,
    })
);

app.use(express.json({ limit: "50mb" }));
app.set("json spaces", 2);

// User router
app.use("/users", userRouter);

app.get("/search", async (req, res) => {
    const searchQuery = req.query.q as string;
    const filter = req.query.filter as string;

    console.log(req.query);

    if (!searchQuery && !filter) {
        return getError(res, 400)("No search query or filter provided");
    }

    const accessToken = req.query.accessToken as string;
    const user = accessToken ? await getUserThroughToken(accessToken) : null;

    const indexRaw = await readFile("./data/search-index.json");
    if (!indexRaw) {
        return getError(res, 500)("Failed to read search index");
    }

    let index: Partial<Pokemon>[] = JSON.parse(indexRaw.toString());
    index = index.map((p: Partial<Pokemon>) => {
        return { ...p, isCustomPokemon: false, isPartial: true };
    });

    if (user) {
        const customPokemon: {
            name: string;
            sprites: {
                front_default: string;
            };
            isCustomPokemon: boolean;
            isPartial: boolean;
        }[] = user.customPokemon.map((p) => {
            return {
                name: p.name,
                sprites: { front_default: p.sprites.front_default },
                isCustomPokemon: true,
                isPartial: false,
            };
        });
        index.push(...customPokemon);
    }

    let results: Partial<Pokemon>[] = [];

    for (const pokemon of index) {
        if (searchQuery && searchQuery !== "undefined") {
            if (pokemon.name?.includes(searchQuery)) {
                results.push(pokemon);
            }
        } else if (filter && filter !== "undefined") {
            const types = pokemon.types?.map((t) => t.type.name);
            console.log("types ", types);

            if (types?.includes(filter)) {
                results.push(pokemon);
            }
        }
    }

    console.log(
        `Search for q ${searchQuery}, filter ${filter} returned ${results.length} results`
    );

    res.json({ results });
});

app.listen(process.env.PORT || 3000, async () => {
    console.log(`API listening on port ${process.env.PORT}`);
});

export {};
