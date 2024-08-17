import React from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Redirect, useHistory } from "react-router";
import LoginForm from "../components/LoginForm";
import { css } from "../../styled-system/css";
import { User } from "../types";
import { center } from "../../styled-system/patterns";
import { markAsFavorite } from "../utils";
import Layout from "../components/Layout";

function Dashboard() {
    const [cachedUser, setCachedUser] = useLocalStorage<User | null>(
        "user",
        null
    );

    if (!cachedUser) {
        return <LoginForm></LoginForm>;
    }

    return (
        <Layout>
            <h1>Welcome to the Dashboard {cachedUser.username}</h1>

            {cachedUser.favorites.length > 0 && (
                <div>
                    <h2>Your favorite pokemons</h2>
                    <div
                        className={css({
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(100px, 1fr))",
                            gap: "4",
                        })}
                    >
                        {cachedUser.favorites.map((pokemon) => (
                            <div key={pokemon.name}>
                                <img
                                    src={pokemon.sprites.front_default}
                                    alt={pokemon.name}
                                    className={css({
                                        width: "100%",
                                        height: "100%",
                                    })}
                                />

                                <button
                                    onClick={async () => {
                                        if (
                                            cachedUser &&
                                            cachedUser.accessToken
                                        ) {
                                            const res = await markAsFavorite(
                                                cachedUser.accessToken,
                                                pokemon.name
                                            );
                                            if (res) {
                                                setCachedUser(res);
                                            } else {
                                                console.error(
                                                    "Failed to mark as favorite"
                                                );
                                            }
                                        } else {
                                            window.location.href = "/login";
                                        }
                                    }}
                                >
                                    remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={() => {
                    setCachedUser(null);
                    window.location.reload();
                }}
                className={css({
                    padding: 2,
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    width: "50%",
                    height: "40px",
                })}
            >
                Logout
            </button>
        </Layout>
    );
}

export default Dashboard;
