import React, { useEffect, useRef, useState } from "react";
import { css } from "../../../styled-system/css";
import { Pokemon, User } from "../../types";
import { useInView } from "framer-motion";
import {
    getAllPokemon,
    getAllTypes,
    getPokemonType,
    runSearch,
} from "../../utils";
import PokemonCard from "./PokemonCard";
import { useInfiniteQuery } from "@tanstack/react-query";

import { get, set, del } from "idb-keyval";
import { useLocalStorage } from "../../hooks/useLocalStorage";

function PokemonList() {
    // Incremental loading with Infinite scroll
    const {
        data: pokemonData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["pokemon"],
        queryFn: async ({ pageParam = 1 }) => {
            const cachedData = await get("pokemon");
            if (
                cachedData &&
                (cachedData.length >= pageParam * 50 || !navigator.onLine)
            ) {
                setAllPokemon(cachedData);
                setCurrentPokemon(cachedData);
                return { results: cachedData, next: true };
            }

            const data = await getAllPokemon(pageParam as number);
            const allData = [...allPokemon, ...data.results];
            setAllPokemon(allData);
            setCurrentPokemon(allData);
            await set("pokemon", allData);
            return data;
        },
        initialPageParam: 1,

        getNextPageParam: (
            lastPage: { next: any },
            allPages: string | any[]
        ) => {
            if (lastPage.next) {
                return allPages.length + 1;
            }
        },
    });

    const loadMoreRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(loadMoreRef, {
        once: false,
    });

    const [allPokemon, setAllPokemon] = useState<Pokemon[]>(
        pokemonData?.pages
            .map((page: { results: any }) => page.results)
            .flat() || []
    );
    const [isFetching, setIsFetching] = useState(isFetchingNextPage);
    const [currentPokemon, setCurrentPokemon] = useState<Pokemon[]>(allPokemon);

    const [searchQuery, setSearchQuery] = useState<string | undefined>(
        undefined
    );
    const [currentFilter, setCurrentFilter] = useState<string | undefined>("");
    const [cachedUser, setCachedUser] = useLocalStorage<User | null>(
        "user",
        null
    );

    useEffect(() => {
        if (
            isInView &&
            hasNextPage &&
            !isFetching &&
            !searchQuery &&
            !currentFilter
        ) {
            fetchNextPage();
        }
    }, [isInView, hasNextPage, isFetching, setIsFetching, fetchNextPage]);

    async function handleSearch(query: string) {
        setSearchQuery(query);
        if (query.length >= 1) {
            // Handle online search
            if (navigator.onLine) {
                setIsFetching(true);
                const results = await runSearch(query);
                setCurrentPokemon(results);
                setIsFetching(false);
                return;
            }
            // Handle offline search (Covers only pokemon that are loaded)
            const cachedData = await get("pokemon");
            const results = cachedData.filter((p: { name: string }) =>
                p.name.toLowerCase().includes(query.toLowerCase())
            );
            setCurrentPokemon(results);
        } else {
            setCurrentPokemon(allPokemon);
        }
    }

    function handleFilter(e: React.ChangeEvent<HTMLSelectElement>) {
        const type = e.target.value;
        if (type === "") {
            setCurrentFilter("");
            setCurrentPokemon(allPokemon);
            return;
        }
        setCurrentFilter(type);
        const results = allPokemon.filter((p) =>
            p.types.some((t) => t.type.name === type)
        );
        setCurrentPokemon(results);
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
            <div
                className={css({
                    display: "flex",
                    flexDirection: "row",
                    gap: "8px",
                    "@media (max-width: 768px)": {
                        flexDirection: "column",
                    },
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

                <select
                    className={css({
                        padding: 4,
                        width: "100%",
                        border: "1px solid ",
                        borderColor: "yellow.300",
                        borderRadius: 4,
                    })}
                    onChange={handleFilter}
                >
                    <option
                        style={{
                            backgroundColor: "black",
                            color: "yellow.300",
                        }}
                        value=""
                    >
                        All Types
                    </option>
                    {getAllTypes().map((type, idx) => {
                        return (
                            <option
                                key={type + "-" + idx}
                                style={{
                                    backgroundColor: "black",
                                    color: "yellow.300",
                                }}
                                value={type.name}
                            >
                                {type.name}
                            </option>
                        );
                    })}
                </select>
            </div>

            <div
                className={css({
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: 4,
                    color: "yellow.300",
                })}
            >
                {currentPokemon
                    .sort((p1, p2) => {
                        const isP1Favorite = cachedUser?.favorites.find(
                            (p) => p.name === p1.name
                        );
                        const isP2Favorite = cachedUser?.favorites.find(
                            (p) => p.name === p2.name
                        );

                        if (isP1Favorite && !isP2Favorite) return -1;
                        if (!isP1Favorite && isP2Favorite) return 1;
                        return 0;
                    })
                    .map((p, idx) => {
                        const isPartial = Object.keys(p).length === 2;

                        return (
                            <div key={p.name + "-" + idx}>
                                <PokemonCard
                                    key={p.name}
                                    pokemon={isPartial ? p.name : p}
                                />
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
