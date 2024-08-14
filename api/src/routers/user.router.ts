import e, { Request, Response } from "express";
import authenticateUser from "../middleware/authenticateUser";

const userRouter = e.Router();



type AuthenticatedRequest = Request & {
    user: {
        id: string;
        name: string;
        email: string;
    };
};

const favoritePokemon = new Map<string, string[]>();






userRouter.get("/@me", authenticateUser, async (req: Request, res: Response) => {
    const authenticatedReq = req as AuthenticatedRequest;


    res.json(authenticatedReq.user);
});


userRouter.get("/@me/favorite/:pokemon", authenticateUser, async (req: Request, res: Response) => {
    const authenticatedReq = req as AuthenticatedRequest;
    const { pokemon } = req.params;

    const favorates = favoritePokemon.get(authenticatedReq.user.id) || [];

    if (favorates.includes(pokemon)) {
        favorates.splice(favorates.indexOf(pokemon), 1);
    }else{
        favorates.push(pokemon);
    }

    favoritePokemon.set(authenticatedReq.user.id, favorates);
    
    res.json({ success: true });

});




export default userRouter;