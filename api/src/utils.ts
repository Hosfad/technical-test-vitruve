import { Response } from "express";
import { existsSync, mkdir } from "fs";
import { readdir, readFile, writeFile } from "fs/promises";
import { User } from "./types";

const usersDir = "./data/users";
if (!existsSync(usersDir)) {
    mkdir(usersDir, { recursive: true }, (err) => {
        if (err) throw err;
    });
}

export async function getUserInfo(email: string): Promise<User | null> {
    try {
        const data = await readFile(`${usersDir}/${email}.json`, "utf-8");

        if (!data) return null;

        return JSON.parse(data);
    } catch (error) {
        console.error(error);
        return null;
    }
}
export async function getAllUsers(): Promise<User[]> {
    const all: User[] = [];
    const files = await readdir(usersDir);
    for (const file of files) {
        const data = await readFile(`${usersDir}/${file}`, "utf-8");
        if (!data) continue;
        all.push(JSON.parse(data));
    }
    return all;
}
export async function getUserThroughToken(token: string): Promise<User | null> {
    const all = await getAllUsers();

    const user = all.find((u) => u.accessToken === token);
    return user || null;
}

export async function saveUser(user: User) {
    await writeFile(
        `${usersDir}/${user.email}.json`,
        JSON.stringify(user, null, 2)
    );

    return user;
}

export const getError = (res: Response, status: number) => (error: string) =>
    res.status(status).json({ error });
