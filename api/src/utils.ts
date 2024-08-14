import { readFileSync } from "fs";
import {  Pokemon } from "./types";


export function getPokemon(name: string): Promise<Pokemon> {
    
    const data = readFileSync(`./data/${
        name
    }.json`, "utf-8");
    return JSON.parse(data);
}



