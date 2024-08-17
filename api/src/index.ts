import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { readFile } from "fs/promises";
import userRouter from "./routers/user.router";
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
    if (!searchQuery) {
        return getError(res, 400)("Missing search query");
    }
    const accessToken = req.query.accessToken as string;
    const user = accessToken ? await getUserThroughToken(accessToken) : null;

    const indexRaw = await readFile("./data/search-index.json");
    if (!indexRaw) {
        return getError(res, 500)("Failed to read search index");
    }

    let index = JSON.parse(indexRaw.toString());
    index = index.map((p: any) => {
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

    const results = index.filter((p: any) =>
        p.name.includes(searchQuery.toLowerCase())
    );

    console.log(`Search for ${searchQuery} returned ${results.length} results`);

    res.json({ results });
});

app.listen(process.env.PORT || 3000, async () => {
    console.log(`API listening on port ${process.env.PORT}`);
});

export {};
