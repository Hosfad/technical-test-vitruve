import React, { useEffect, useRef, useState } from "react";
import { css } from "../../styled-system/css";
import { Pokemon } from "../types";
import { useInView } from "framer-motion";
import { getAllPokemon, runSearch } from "../utils";
import { useInfiniteQuery } from "react-query";
import PokemonCard from "./PokemonCard";

function PokemonList() {
    // Incremental loading with Infinite scroll
    const {
        data: pokemonData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery(
        "pokemon",
        async ({ pageParam = 1 }) => {
            const data = await getAllPokemon(pageParam);
            return data;
        },
        {
            getNextPageParam: (lastPage, pages) => {
                if (lastPage.next) {
                    return pages.length + 1;
                }
            },
            onSuccess: (data) => {
                const all = data.pages.map((page) => page.results).flat();
                setAllPokemon(all);
                setCurrentPokemon(all);
            },
        }
    );

    const loadMoreRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(loadMoreRef, {
        once: false,
    });

    const [allPokemon, setAllPokemon] = useState<Pokemon[]>(
        pokemonData?.pages.map((page) => page.results).flat() || []
    );
    const [isFetching, setIsFetching] = useState(isFetchingNextPage);
    const [currentPokemon, setCurrentPokemon] = useState<Pokemon[]>(allPokemon);

    const [searchQuery, setSearchQuery] = useState<string | undefined>(
        undefined
    );

    useEffect(() => {
        if (isInView && hasNextPage && !isFetching && !searchQuery) {
            fetchNextPage();
        }
    }, [isInView, hasNextPage, isFetching, setIsFetching, fetchNextPage]);

    async function handleSearch(query: string) {
        setSearchQuery(query);
        if (query.length >= 1) {
            setIsFetching(true);
            const results = await runSearch(query);
            setCurrentPokemon(results);
            setIsFetching(false);
        } else {
            setCurrentPokemon(allPokemon);
        }
    }

    return (
        <div
            className={css({
                display: "flex",
                flexDirection: "column",
                gap: 4,
                padding: 4,
                borderRadius: 4,
                width: "100%",
                height: "100%",
            })}
        >
            <input
                className={css({
                    padding: 4,
                    width: "100%",
                    border: "1px solid ",
                    borderColor: "yellow.300",
                    _placeholder: {
                        color: "yellow.300",
                    },
                    borderRadius: 4,
                })}
                placeholder="Search pokemon"
                onChange={(e) => handleSearch(e.target.value)}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
            ></input>
            <div
                className={css({
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: 4,
                    color: "yellow.300",
                })}
            >
                {currentPokemon.map((p, idx) => {
                    const isPartial = Object.keys(p).length === 2;

                    return (
                        <div key={p.name + "-" + idx}>
                            <PokemonCard key={p.name} pokemon={isPartial ? p.name : p} />
                        </div>
                    );
                })}

                {!searchQuery && (
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
                )}
            </div>
        </div>
    );
}

export default PokemonList;
