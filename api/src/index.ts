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
    if (!searchQuery && !filter) {
        return getError(res, 400)("No search query or filter provided");
    }

    const accessToken = req.query.accessToken as string;
    const user = accessToken ? await getUserThroughToken(accessToken) : null;

    const indexRaw = await readFile("./data/search-index.json");

    const failedToReadIndex = getError(res, 500);
    if (!indexRaw) {
        return failedToReadIndex("Failed to read search index");
    }

    /**@todo surround with try catch */
    let index: Partial<Pokemon>[];
    try {
        index = JSON.parse(indexRaw.toString());
    } catch (e) {
        return failedToReadIndex("Failed to parse index json");
    }

    index = index.map((p: Partial<Pokemon>) => {
        return { ...p, isCustomPokemon: false, isPartial: true };
    });

    // Add custom pokemon to the search index if a user is authenticated
    if (user) {
        const customPokemon = user.customPokemon.map((p) => {
            return {
                name: p.name,
                sprites: { front_default: p.sprites.front_default },
                isCustomPokemon: true,
                isPartial: false,
            };
        });
        index.push(...customPokemon);
    }

    let results: Partial<Pokemon>[] = index;

    if (filter && filter !== "undefined") {
        results = results.filter((p) => {
            const types = p.types?.map((t) => t.type.name);
            return types?.includes(filter);
        });
    }
    if (searchQuery && searchQuery !== "undefined") {
        results = results.filter((p) => p.name?.includes(searchQuery));
    }

    console.log(
        `Search for q ${searchQuery}, filter ${filter} returned ${results.length} results`
    );

    res.json({ results });
});
let port = process.env.PORT || 8089;
app.listen(port, async () => {
    console.log(`API listening on port ${port}`);
});

export {};
