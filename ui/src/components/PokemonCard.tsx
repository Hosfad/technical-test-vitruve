import { useInView, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { css } from "../../styled-system/css";
import { Pokemon } from "../types";
import { getPokemon, capitalizeFirstLetter } from "../utils";
import PokemonWidget from "./PokemonWidget";

const PokemonCard = ({ pokemon }: { pokemon: Pokemon | string }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });

    const [currentPokemon, setCurrentPokemon] = React.useState<Pokemon | null>(
        null
    );

    useEffect(() => {
        if (typeof pokemon === "string") {
            getPokemon(pokemon).then((data) => {
                setCurrentPokemon(data);
            });
        } else {
            setCurrentPokemon(pokemon);
        }
    }, [pokemon]);

    const [isOpen, setOpen] = useState(false);

    return (
        <div >
            <motion.div
                ref={ref}
                className={css({
                    padding: 4,
                    border: "1px solid",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "between",
                })}
                initial={{ scale: 0, opacity: 0, x: -100 }}
                animate={isInView ? { scale: 1, opacity: 1, x: 0 } : {}}
                whileHover={{ scale: 1.1 }}
                onClick={() => setOpen(!isOpen)}
            >
                <img src={currentPokemon?.sprites.front_default || ""}></img>
                <p>{capitalizeFirstLetter(currentPokemon?.name|| "") }</p>
            </motion.div>
            <PokemonWidget
                pokemon={currentPokemon}
                isOpen={isOpen}
                setOpen={setOpen}
            ></PokemonWidget>
        </div>
    );
};

export default PokemonCard;