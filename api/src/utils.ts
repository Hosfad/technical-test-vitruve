import { existsSync, mkdir, readdirSync, readFileSync, writeFileSync } from "fs";
import { Pokemon, PokemonData, User } from "./types";
import axios from "axios";

const usersDir = "./data/users";
if (!existsSync(usersDir)) {
    mkdir(usersDir, { recursive: true }, (err) => {
        if (err) throw err;
    });
}

export function getUserInfo(email: string): User | null {
    const exists = existsSync(`${usersDir}/${email}.json`);
    if (!exists) {
        return null;
    }

    const data = readFileSync(`${usersDir}/${email}.json`, "utf-8");
    return JSON.parse(data);
}
export function getAllUsers(): User[] {
    const all: User[] = [];
    for (const file of readdirSync(usersDir)) {
        const data = readFileSync(`${usersDir}/${file}`, "utf-8");
        all.push(JSON.parse(data) as User);
    }
    return all;
}
export function getUserThroughToken(token: string): User | null {
    const all = getAllUsers();
    
    const user = all.find((u) => u.accessToken === token);
    return user || null;
}

export function saveUser(user: User) {
    writeFileSync(
        `${usersDir}/${user.email}.json`,
        JSON.stringify(user, null, 2)
    );

    return user;
}
