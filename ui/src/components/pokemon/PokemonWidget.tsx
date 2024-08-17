import React from "react";
import { css } from "../../../styled-system/css";
import { Pokemon, User } from "../../types";
import {
    capitalizeFirstLetter,
    getPokemonType,
    markAsFavorite,
} from "../../utils";
import SideWidget from "../SideWidget";
import CreateOrEditPokemonWidget from "./CreateOrEditPokemonWidget";

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
    const StarFull = () => {
        return (
            <svg
                stroke="#fcd34d"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                className={css({
                    width: 8,
                    fill: "yellow.300", // Explicitly set the fill property
                    borderColor: "yellow.300",
                })}
            >
                <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" />
            </svg>
        );
    };

    const StarEmpty = () => {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                stroke="#fcd34d"
                viewBox="0 0 576 512"
                className={css({
                    width: 8,
                    fill: "yellow.300", // Explicitly set the fill property
                    borderColor: "yellow.300",
                })}
            >
                <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" />
            </svg>
        );
    };

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

            {!pokemon.isCustomPokemon && (
                <button
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
                    cachedUser.favorites?.find(
                        (p) => p.name === pokemon.name
                    ) ? (
                        <StarEmpty />
                    ) : (
                        <StarFull />
                    )}
                </button>
            )}

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
                {pokemon.stats?.map((stat) => (
                    <StatsProgressBar
                        key={stat.stat.name}
                        stat={stat.stat.name}
                        base_stat={stat.base_stat}
                    />
                ))}
            </div>

            {pokemon.isCustomPokemon && (
                <CreateOrEditPokemonWidget
                    pokemon={pokemon}
                ></CreateOrEditPokemonWidget>
            )}
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
