import { NextFunction, Request, Response } from "express";




export default function authenticateUser(req:Request, res:Response, next:NextFunction) {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: "No authorization header" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).json({ error: "Missing access token" });
    }
    try {


        // we are gonna assume that the token is valid for the sake of this test 
        const tokenValid = true;
        if (!tokenValid) {
            return res.status(401).json({ error: "Invalid token" });
        }


        // We pass the user object the request object so that it can be used in the route handler

        //@ts-ignore
        req.user = {
            id: 1,
            name: "testuser",
            email: "test@vitruve.fit"
        }

        next();
  
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
}