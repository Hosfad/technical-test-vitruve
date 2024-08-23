import e from "express";
import PokemonController from "../controllers/PokemonController";
import authenticateUser from "../middleware/authenticateUser";

const pokemonRouter = e.Router({ mergeParams: true });

// call authenticateUser on all endpoints in /users/pokemon
pokemonRouter.use(authenticateUser);

pokemonRouter.get("/favorite/:pokemon", PokemonController.makeFavorite);
pokemonRouter.put("/", PokemonController.createNewPokemon);
pokemonRouter.post("/:id", PokemonController.editPokemon);
pokemonRouter.delete("/:id", PokemonController.deletePokemon);

export default pokemonRouter;
