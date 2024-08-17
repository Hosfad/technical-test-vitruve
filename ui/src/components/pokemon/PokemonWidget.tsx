import React, { useEffect, useRef } from "react";
import { Pokemon, User } from "../../types";
import { css } from "../../../styled-system/css";
import { AnimatePresence, motion } from "framer-motion";
import {
    capitalizeFirstLetter,
    getPokemon,
    getPokemonType,
    markAsFavorite,
} from "../../utils";
import SideWidget from "../SideWidget";

function PokemonWidget({
    pokemon,
    isOpen,
    setOpen,
    cachedUser,
    setCachedUser,
}: {
    pokemon: Pokemon | null;
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    cachedUser: User | null;
    setCachedUser: (user: User | null) => void;
}) {
    const [isEditing, setIsEditing] = React.useState(false);

    return pokemon ? (
        <SideWidget isOpen={isOpen} setIsOpen={setOpen}>
            <div
                className={css({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                })}
            >
                <img
                    src={pokemon.sprites?.front_default}
                    alt={pokemon.name}
                    className={css({ width: 100, height: 100 })}
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

            <button
                className={css({
                    padding: 2,
                    backgroundColor: "yellow.300",
                    color: "black",
                    border: "1px solid",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "100%",
                    height: "40px",
                    marginTop: 8,
                })}
                onClick={async () => {
                    if (cachedUser && cachedUser.accessToken) {
                        const res = await markAsFavorite(
                            cachedUser.accessToken,
                            pokemon.name
                        );
                        if (res) {
                            setCachedUser(res);
                        } else {
                            console.error("Failed to mark as favorite");
                        }
                    } else {
                        window.location.href = "/login";
                    }
                }}
            >
                {cachedUser &&
                cachedUser.favorites?.find((p) => p.name === pokemon.name)
                    ? "Unmark as favorite"
                    : "Mark as favorite"}
            </button>
            <button
                className={css({
                    padding: 2,
                    backgroundColor: "yellow.300",
                    color: "black",
                    border: "1px solid",
                    borderRadius: "5px",
                    cursor: "pointer",
                    width: "100%",
                    height: "40px",
                    marginTop: 8,
                })}
                onClick={() => setIsEditing(true)}
            >
                Edit Pokemon
            </button>
            <SideWidget isOpen={isEditing} setIsOpen={setIsEditing}>
                <h1>Edit Pokemon</h1>
            </SideWidget>
        </SideWidget>
    ) : (
        <></>
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
