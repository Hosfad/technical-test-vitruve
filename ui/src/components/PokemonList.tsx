import React, { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "react-query";
import { getAllPokemon } from "../requests";
import { Pokemon } from "../types";
import { css } from "../../styled-system/css";
import { center } from "../../styled-system/patterns";
import { motion, useInView } from "framer-motion";
import PokemonWidget from "./PokemonWidget";

function PokemonList() {
    const {
        data: pokemonData,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery(
        "pokemon",
        async ({ pageParam = 1 }) => {
            return await getAllPokemon(pageParam);
        },
        {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage.next) {
                    return pages.length + 1;
                }
            },
        }
    );

    const loadMoreRef = useRef(null);


    const isInView = useInView(loadMoreRef, {
        once: false,
    });

    useEffect(() => {
        if (isInView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [isInView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {JSON.stringify(error, null, 2)}</div>;
    }

    return (
        <div  className={center({ h: "full" })}>
            <div
                className={css({
                    display: "grid",
                    position: "relative",
                    gridTemplateColumns: "1fr",
                    gap: 6,
                    fontWeight: "semibold",
                    color: "yellow.300",
                    textAlign: "center",
                    textStyle: "4xl",
                    "@media(min-width: 768px)": {
                        gridTemplateColumns: "repeat(3, 1fr)",
                    },
                })}

            >
                {pokemonData?.pages.map((page, i) =>
                    page.results.map((pokemon) => (
                        <PokemonListItem key={pokemon.name} pokemon={pokemon} />
                    ))
                )}

                <div
                    ref={loadMoreRef}
                    className={css({
                        display: "flex",
                        justifyContent: "center",
                        gap: 4,
                        marginTop: 4,
                    })}
                >
                    {hasNextPage ? (
                        isFetchingNextPage ? (
                            <div>Loading more...</div>
                        ) : (
                            <button
                                onClick={() => {
                                    fetchNextPage();
                                }}
                            >
                                Load more
                            </button>
                        )
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        </div>
    );
}

const PokemonListItem = ({ pokemon }: { pokemon: Pokemon }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { once: true });

    const [widgetOpen, setWidgetOpen] = React.useState(false);

    return (
        <motion.div
            ref={ref}
            className={css({
                border: "1px solid",
                borderColor: "yellow.300",
                borderRadius: 5,
                padding: 10,
                alignItems: "center",
                cursor: "pointer",
            })}
            initial={{ scale: 0, opacity: 0, x: -100 }}
            animate={isInView ? { scale: 1, opacity: 1, x: 0 } : {}}
            onClick={() => setWidgetOpen(!widgetOpen)}
        >
            {/** Name and Image */}
            <div
                className={css({
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "between",
                })}
            >
                <img src={pokemon.sprites?.front_default} alt={pokemon.name} />
                <h1>{pokemon.name}</h1>
            </div>

            <PokemonWidget
                pokemon={pokemon}
                isOpen={widgetOpen}
                setOpen={setWidgetOpen}
            />
        </motion.div>
    );
};

export default PokemonList;
