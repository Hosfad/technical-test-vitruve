import crypto from "crypto";
import { Response } from "express";
import { existsSync, mkdir } from "fs";
import { readdir, readFile, writeFile } from "fs/promises";
import { User } from "./types";

const usersDir = "./data/users";
// This is sync to make sure dir exists b4 reading/righting to it
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

export async function hashPassword(
    password: string,
    salt: string
): Promise<string> {
    const hashedPasswordBuffer = await crypto.pbkdf2Sync(
        password,
        salt,
        1000,
        64,
        "sha256"
    );

    const hashedPassword = getStringFromBuffer(hashedPasswordBuffer);

    return hashedPassword;
}
export const getStringFromBuffer = (buffer: ArrayBuffer) =>
    Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

export const parseUserForResponse = async (user: User) => {
    await saveUser(user);
    delete user.password;
    delete user.salt;
    return user;
};

export const getError = (res: Response, status: number) => (error: string) =>
    res.status(status).json({ error });
