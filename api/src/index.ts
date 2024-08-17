import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/user.router";
import { readFileSync } from "fs";
import { getAllUsers, getUserThroughToken } from "./utils";
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

const indexRaw = readFileSync("./data/search-index.json");
const index = JSON.parse(indexRaw.toString());

index.forEach((p: any) => {
    app.get(`/pokemon/${p.name}`, (req, res) => {
        res.json(p);
    });
});

app.get("/search", (req, res) => {
    const searchQuery = req.query.q as string;
    if (!searchQuery) {
        return res.status(400).json({ error: "Missing search query" });
    }

    const indexRaw = readFileSync("./data/search-index.json");
    const index = JSON.parse(indexRaw.toString());
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
