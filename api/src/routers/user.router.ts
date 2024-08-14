import e, { Request, Response } from "express";
import authenticateUser from "../middleware/authenticateUser";
import { User } from "../types";
import { getUserInfo, saveUser } from "../utils";

const userRouter = e.Router();



type AuthenticatedRequest = Request & {
    user:User;
};



userRouter.get("/@me", authenticateUser, async (req: Request, res: Response) => {
    const authenticatedReq = req as AuthenticatedRequest;

    res.json(authenticatedReq.user);
});


userRouter.get("/@me/favorite/:pokemon", authenticateUser, async (req: Request, res: Response) => {
    const authenticatedReq = req as AuthenticatedRequest;
    const { pokemon } = req.params;
    const user = authenticatedReq.user;
    if (!user.favorites.includes(pokemon)) {
        user.favorites.push(pokemon);
    }else{
        user.favorites.splice(user.favorites.indexOf(pokemon), 1);
    }

    saveUser(authenticatedReq.user);
    res.json({ success: true });
});

userRouter.post("/signup", async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const exists = getUserInfo(email);
    if (exists) {
        return res.status(400).json({ error: "User already exists" });
    }

    // In a real world we would hash the password before saving it but for the sake of this test we are gonna save it as is :P
    const user: User = {
        email,
        password,
        name,
        favorites: []
    };
    saveUser(user);

    res.json(user);
});


userRouter.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const user = getUserInfo(email);
    console.log(user);
    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const accessToken = Math.random().toString(36);
    
    user.accessToken = accessToken;
    saveUser(user);

    res.json(user);
}
);



export default userRouter;