import { motion, useInView } from "framer-motion";
import React, { useState } from "react";
import { css } from "../../../styled-system/css";
import { Pokemon, User } from "../../types";
import { capitalizeFirstLetter } from "../../utils";
import PokemonWidget from "./PokemonWidget";

const PokemonCard = ({
    pokemon,
    isCustomPokemon,
    cachedUser,
    setCachedUser,
}: {
    pokemon: Pokemon | Partial<Pokemon>;
    isCustomPokemon?: boolean;
    cachedUser: User | null;
    setCachedUser: (user: User | null) => void;
}) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });

    const [isOpen, setOpen] = useState(false);

    return (
        <div>
            <motion.div
                id="pokemon-card"
                ref={ref}
                className={css({
                    padding: 4,
                    border: "1px solid",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "between",
                    cursor: "pointer",
                })}
                initial={{ scale: 0, opacity: 0, x: -100 }}
                animate={isInView ? { scale: 1, opacity: 1, x: 0 } : {}}
                whileHover={{ scale: 1.1 }}
                onClick={() => setOpen(!isOpen)}
            >
                <div
                    className={css({
                        width: "96px",
                        height: "96px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "4px",
                        overflow: "hidden",
                    })}
                >
                    {pokemon?.sprites?.front_default ? (
                        <img
                            src={pokemon.sprites.front_default}
                            alt={pokemon.name}
                            className={css({
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                            })}
                        />
                    ) : (
                        <p>N/A</p>
                    )}
                </div>
                <p>{capitalizeFirstLetter(pokemon?.name || "N/A")}</p>
            </motion.div>

            {isOpen && (
                <PokemonWidget
                    pokemon={pokemon}
                    isOpen={isOpen}
                    setOpen={setOpen}
                    cachedUser={cachedUser}
                    setCachedUser={setCachedUser}
                />
            )}
        </div>
    );
};

export default PokemonCard;
