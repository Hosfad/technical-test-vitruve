import React, { useEffect, useRef } from "react";
import { Pokemon } from "../types";
import { css } from "../../styled-system/css";
import { AnimatePresence, motion } from "framer-motion";
import { capitalizeFirstLetter, getPokemon, getPokemonType } from "../utils";

const sideWidgetStyle = css({
    position: "fixed",
    top: 10,
    right: 0,
    width: "300px",
    height: "100%",
    boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
    backgroundColor: "rgba(13,13,13,255)",
    zIndex: 999,
    padding: "20px",
    overflowY: "auto",
});

function PokemonWidget({
    pokemon,
    isOpen,
    setOpen,
}: {
    pokemon: Pokemon | null;
    isOpen: boolean;
    setOpen: (b: boolean) => void;
}) {
    if (!pokemon) return null;
    const widgetRef = useRef<HTMLDivElement>(null);

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

    const initial = { opacity: 0, x: 300 };
    const animate = { opacity: 1, x: 0 };
    const exit = { opacity: 0, x: 300 };

    return (
        <AnimatePresence>
            {pokemon && isOpen && (
                <motion.div
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    ref={widgetRef}
                    className={sideWidgetStyle}
                >
                    <div
                        className={css({
                            display: "flex",
                            position: "relative",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "between",
                        })}
                    >
                        {isOpen && (
                            <motion.div
                                onClick={() => setOpen(false)}
                                className={css({
                                    position: "absolute ",
                                    right: 0,
                                    top: 4,
                                    color: "yellow.300",
                                    border : "1px solid",
                                    borderColor : "yellow.300",
                                    borderRadius: "10%",
                                    padding : 1,
                                    paddingX : 3,
                                    zIndex: 1000,
                                    cursor : "pointer"
                                })}
                            >
                                x
                            </motion.div>
                        )}

                        <img
                            src={pokemon.sprites?.front_default}
                            alt={pokemon.name}
                        />
                        <h1>{capitalizeFirstLetter(pokemon.name)}</h1>
                    </div>

                    <h1 className={css({ textAlign: "start" })}>Types:</h1>
                    <div className={css({ display: "flex", gap: 2 })}>
                        {pokemon.types?.map((type) => {
                            const imgUrl = getPokemonType(type.type.name)?.url;
                            return (
                                <img
                                    className={css({ width: 16 })}
                                    key={imgUrl}
                                    src={imgUrl}
                                ></img>
                            );
                        })}
                    </div>

                    <h1 className={css({ textAlign: "start" })}>
                        Size:
                        <span className={css({ fontSize: "sm" })}>
                            {" "}
                            0.{pokemon.height}/m, 0.{pokemon.weight}/kg
                        </span>
                    </h1>

                    <h1 className={css({ textAlign: "start" })}>Base stats:</h1>

                    <div
                        id={`stats-widget-${pokemon.name}`}
                        className={css({
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                        })}
                    >
                        {pokemon.stats.map((stat) => (
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
