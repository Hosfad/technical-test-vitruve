import { motion, useInView } from "framer-motion";
import React, { useEffect, useState } from "react";
import { css } from "../../../styled-system/css";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Pokemon, User } from "../../types";
import { capitalizeFirstLetter, getPokemon } from "../../utils";
import PokemonWidget from "./PokemonWidget";

const PokemonCard = ({
    pokemon,
    isCustomPokemon,
}: {
    pokemon: Pokemon | string;
    isCustomPokemon?: boolean;
}) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });

    const [currentPokemon, setCurrentPokemon] = React.useState<Pokemon | null>(
        null
    );
    const [isOpen, setOpen] = useState(false);
    const [cachedUser, setCachedUser] = useLocalStorage<User | null>(
        "user",
        null
    );

    useEffect(() => {
        if (typeof pokemon === "string") {
            getPokemon(pokemon, isCustomPokemon ? cachedUser! : undefined).then(
                (data) => {
                    setCurrentPokemon(data);
                }
            );
        } else {
            setCurrentPokemon(pokemon);
        }
    }, [pokemon]);

    return (
        <div>
            <motion.div
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
                    {currentPokemon?.sprites?.front_default ? (
                        <img
                            src={currentPokemon.sprites.front_default}
                            alt={currentPokemon.name}
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
                <p>{capitalizeFirstLetter(currentPokemon?.name || "N/A")}</p>
            </motion.div>

            <PokemonWidget
                pokemon={currentPokemon}
                isOpen={isOpen}
                setOpen={setOpen}
                cachedUser={cachedUser}
                setCachedUser={setCachedUser}
            />
        </div>
    );
};

export default PokemonCard;
