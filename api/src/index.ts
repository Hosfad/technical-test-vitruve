import express from "express";
import cors from "cors";
import dotenv from "dotenv";
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

app.listen(process.env.PORT || 3000, async () => {
    console.log(`API listening on port ${process.env.PORT}`);
});


export {};
