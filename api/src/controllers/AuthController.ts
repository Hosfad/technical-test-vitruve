import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { User } from "../types";
import {
    getError,
    getUserInfo,
    hashPassword,
    parseUserForResponse,
} from "../utils";

export async function signIn(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return getError(res, 400)("Missing required fields");
    }
    const notAuthorized = getError(res, 401);

    const user = await getUserInfo(email);
    if (!user) return notAuthorized("User not found");

    const hashedPassword = await hashPassword(password, user.salt!);

    if (user.password !== hashedPassword) {
        return notAuthorized("Incorrect password");
    }

    res.json(await parseUserForResponse(user));
}

export async function signUp(req: Request, res: Response) {
    const { email, password, username } = req.body;

    const badRequest = getError(res, 400);
    if (!email || !password || !username) {
        return badRequest("Missing required fields");
    }

    const exists = await getUserInfo(email);
    if (exists) {
        const hashedPassword = await hashPassword(password, exists.salt!);
        if (hashedPassword !== exists.password) {
            return badRequest("Email already in use");
        }
        return res.json(await parseUserForResponse(exists));
    }

    const accessToken = uuidv4();
    const salt = uuidv4();

    // In a real world we would have an expiration date for the accessToken but for this test thats not needed.
    const user: User = {
        email,
        password: await hashPassword(password, salt),
        username,
        favorites: [],
        customPokemon: [],
        accessToken,
        salt,
    };

    res.json(await parseUserForResponse(user));
}
export default {
    signIn,
    signUp,
};
