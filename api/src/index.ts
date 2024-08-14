import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/user.router";
import { getAllPokemon } from "./utils";
import { readFileSync } from "fs";
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

app.use(express.json());
app.set("json spaces", 2);

app.use("/users" , userRouter);
app.get("/search" , (req, res) => {

const searchQuery = req.query.q as string;
if (!searchQuery) {
    return res.status(400).json({ error: "Missing search query" });
}

const indexRaw = readFileSync("./data/search-index.json");
const index = JSON.parse(indexRaw.toString());
const results = index.filter((p: any) => p.name.includes(searchQuery.toLowerCase()));

console.log(`Search for ${searchQuery} returned ${results.length} results`);

res.json({ results });
});

app.listen(process.env.PORT || 3000, async () => {
    console.log(`API listening on port ${process.env.PORT}`);
});


export {};
