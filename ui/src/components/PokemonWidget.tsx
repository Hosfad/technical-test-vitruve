import React, { useEffect, useRef } from "react";
import { Pokemon } from "../types";
import { css } from "../../styled-system/css";
import { AnimatePresence, motion } from "framer-motion";
import { getPokemon, getPokemonType } from "../requests";

const sideWidgetStyle = css({
    position: "fixed",
    top: 10,
    right: 0,
    width: "300px",
    height: "100%",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: "rgba(13,13,13,255)",
    zIndex: 1000,
    padding: "20px",
    overflowY: "auto",
});

function PokemonWidget({
    pokemon,
    isOpen,
    setOpen,
}: {
    pokemon: Pokemon | string;
    isOpen: boolean;
    setOpen: (b: boolean) => void;
}) {
    const widgetRef = useRef<HTMLDivElement>(null);

    const [currentPokemon, setCurrentPokemon] = React.useState<Pokemon>();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                widgetRef.current &&
                !widgetRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, setOpen]);

    useEffect(() => {
        if (typeof pokemon === "string") {
            getPokemon(pokemon).then((data) => {
                setCurrentPokemon(data);
            });
        } else {
            setCurrentPokemon(pokemon);
        }
    }, [pokemon]);

    return (
        <AnimatePresence>
            {currentPokemon && isOpen && (
                <motion.div
                    initial={{ x: 300 }}
                    animate={{ x: 0 }}
                    exit={{ x: 300 }}
                    ref={widgetRef}
                    className={sideWidgetStyle}
                >
                    <div
                        className={css({
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "between",
                        })}
                    >
                        <img
                            src={currentPokemon.sprites?.front_default}
                            alt={currentPokemon.name}
                        />
                        <h1>{currentPokemon.name}</h1>
                    </div>

                    <h1 className={css({ textAlign: "start" })}>Types:</h1>
                    <div className={css({ display: "flex", gap: 2 })}>
                        {currentPokemon.types.map((type) => {
                            const imgUrl = getPokemonType(type.type.name)?.url;
                           return (<img className={css({width :16})} key={imgUrl} src={imgUrl}></img>)
                        })}
                    </div>
                    
                    <h1 className={css({ textAlign: "start" })}>Size: 
                        <span className={css({fontSize : "sm"})}> 0.{currentPokemon.height}/m, 0.{currentPokemon.weight}/kg</span>
                        </h1>
               
                    <h1 className={css({ textAlign: "start" })}>Base stats:</h1>

                    <div
                        id={`stats-widget-${currentPokemon.name}`}
                        className={css({
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                        })}
                    >
                        {currentPokemon.stats.map((stat) => (
                            <StatsProgressBar
                                key={stat.stat.name}
                                stat={stat.stat.name}
                                base_stat={stat.base_stat}
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

const StatsProgressBar = ({
    stat,
    base_stat,
}: {
    stat: string;
    base_stat: number;
}) => {
    const progressBarWidth = `${(base_stat / 255) * 100}%`;

    const color =
        base_stat > 150 ? "green" : base_stat > 100 ? "orange" : "yellow";

    return (
        <div>
            <div
                className={css({
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 4,
                })}
            >
                <label className={css({ fontSize: "medium" })}>{stat}</label>

                <label className={css({ fontSize: "medium" })}>
                    {base_stat}
                </label>
            </div>

            <div
                className={css({
                    width: "100%",
                    backgroundColor: "#e0e0df",
                    borderRadius: "5px",
                    overflow: "hidden",
                    height: "12px",
                })}
            >
                <div
                    style={{
                        width: progressBarWidth,
                        backgroundColor: color,
                        height: "100%",
                    }}
                ></div>
            </div>
        </div>
    );
};

export default PokemonWidget;
