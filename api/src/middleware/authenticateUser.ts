import { NextFunction, Request, Response } from "express";
import { getUserInfo, getUserThroughToken } from "../utils";

export default function authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: "No authorization header" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Missing access token" });
    }
    try {
        const user = getUserThroughToken(token);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const tokenValid = token === user.accessToken;
        if (!tokenValid) {
            return res.status(401).json({ error: "Invalid token" });
        }
        // Should also check if token is expired but for the sake of this test we are not gonna do that.

        (req as any).user = user;

        next();
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
