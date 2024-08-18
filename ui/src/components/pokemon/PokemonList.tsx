import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { css } from "../../../styled-system/css";
import { Pokemon, User } from "../../types";
import { getAllPokemon, runSearch } from "../../utils";
import PokemonCard from "./PokemonCard";

import { del, get, set } from "idb-keyval";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import CreateOrEditPokemonWidget from "./CreateOrEditPokemonWidget";
import PokemonTypeSelect from "./PokemonTypeSelect";

function PokemonList() {
    const [cachedUser, setCachedUser] = useLocalStorage<User | null>(
        "user",
        null
    );
    const customPokemon = cachedUser?.customPokemon || [];

    const loadMoreRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(loadMoreRef, {
        once: false,
    });

    // Incremental loading with Infinite scroll
    const {
        data: pokemonData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["pokemon"],
        queryFn: async ({ pageParam = 1 }) => {
            await del("pokemon");
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

    const [allPokemon, setAllPokemon] = useState<Pokemon[]>(
        pokemonData?.pages
            .map((page: { results: any }) => page.results)
            .flat() || []
    );
    const [isFetching, setIsFetching] = useState(isFetchingNextPage);
    const [currentPokemon, setCurrentPokemon] = useState<Pokemon[]>([
        ...allPokemon,
    ]);

    const [searchQuery, setSearchQuery] = useState<string | undefined>(
        undefined
    );
    const [currentFilter, setCurrentFilter] = useState<string | undefined>(
        undefined
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

    async function handleSearch(query?: string, filter?: string) {
        setSearchQuery(query);
        if (query && query.length >= 1) {
            // Handle online search
            if (navigator.onLine) {
                setIsFetching(true);
                const results: Pokemon[] = await runSearch(
                    query,

                    undefined,
                    cachedUser?.accessToken || undefined
                );

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
        } else if (filter && filter !== "All Types") {
            setCurrentFilter(filter);
            if (navigator.onLine) {
                setIsFetching(true);
                const results = await runSearch(
                    undefined,
                    filter,
                    cachedUser?.accessToken || undefined
                );
                setCurrentPokemon(results);
                setIsFetching(false);
                return;
            }
            // Handle offline search (Covers only pokemon that are loaded)
            const cachedData = await get("pokemon");
            const results = cachedData.filter((p: Partial<Pokemon>) =>
                p.types?.some(
                    (t: { type: { name: string } }) =>
                        t.type.name === currentFilter
                )
            );
            setCurrentPokemon(results);
        } else {
            setCurrentPokemon(allPokemon);
        }
    }

    function handleFilter(e: React.ChangeEvent<HTMLSelectElement>) {
        const type = e.target.value;
        if (type === "" || type === "All Types") {
            setCurrentFilter(undefined);
            setCurrentPokemon(allPokemon);

            return;
        }
        setCurrentFilter(type);
        handleSearch(undefined, type);
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

                <PokemonTypeSelect
                    incdludeAllTypes
                    handleChange={handleFilter}
                />
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
                <CreateOrEditPokemonWidget />

                {!searchQuery &&
                    !currentFilter &&
                    customPokemon.map((p, idx) => (
                        <div key={p.name + "-" + idx}>
                            <PokemonCard
                                key={p.name}
                                pokemon={p}
                                isCustomPokemon
                            />
                        </div>
                    ))}

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
                    .filter((p) => {
                        if (searchQuery && !currentFilter) {
                            return p.name.toLowerCase().includes(searchQuery);
                        }
                        if (!searchQuery && currentFilter) {
                            return p.types?.some(
                                (t) => t.type.name === currentFilter
                            );
                        }
                        if (searchQuery && currentFilter) {
                            return (
                                p.name.toLowerCase().includes(searchQuery) &&
                                p.types?.some(
                                    (t) => t.type.name === currentFilter
                                )
                            );
                        }

                        return p;
                    })
                    .map((p, idx) => {
                        const isPartial = Object.keys(p).length === 3;
                        return (
                            <div key={p.name + "-" + idx}>
                                <PokemonCard
                                    key={p.name}
                                    pokemon={
                                        p.isPartial || isPartial ? p.name : p
                                    }
                                    isCustomPokemon={p.isCustomPokemon}
                                />
                            </div>
                        );
                    })}

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
                                    if (
                                        hasNextPage &&
                                        !isFetchingNextPage &&
                                        !searchQuery &&
                                        !currentFilter
                                    ) {
                                        fetchNextPage();
                                    } else {
                                        alert("No more pokemon to load");
                                    }
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

export default PokemonList;
