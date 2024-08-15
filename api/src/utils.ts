import { existsSync, readFileSync, writeFileSync } from "fs";
import { Pokemon, PokemonData, User } from "./types";
import axios from "axios";

const usersDir = "./data/users";


export function getUserInfo(email: string): User | null {
    const exists = existsSync(`${usersDir}/${email}.json`);
    if (!exists) {
        return null;
    }

    const data = readFileSync(`${usersDir}/${email}.json`, "utf-8");
    return JSON.parse(data);
}

export function saveUser(user: User) {
    writeFileSync(
        `${usersDir}/${user.email}.json`,
        JSON.stringify(user, null, 2)
    );

    return user;
}