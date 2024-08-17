import { NextFunction, Request, Response } from "express";
import { getError, getUserThroughToken } from "../utils";

export default async function authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const notAuthorized = getError(res, 401);

    if (!req.headers.authorization) {
        return notAuthorized("No authorization header");
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return notAuthorized("Missing access token");
    }
    try {
        const user = await getUserThroughToken(token);
        if (!user) {
            return notAuthorized("User not found");
        }

        const tokenValid = token === user.accessToken;
        if (!tokenValid) {
            return notAuthorized("Invalid token");
        }

        // Should also check if token is expired but for the sake of this test we are not gonna do that.
        (req as any).user = user;

        next();
    } catch (error) {
        return notAuthorized("Invalid token");
    }
}
