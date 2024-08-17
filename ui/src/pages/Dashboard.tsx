import { css } from "../../styled-system/css";
import Layout from "../components/Layout";
import LoginForm from "../components/LoginForm";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { User } from "../types";
import { markAsFavorite } from "../utils";

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
                    window.location.href = "/";
                }}
                className={css({
                    padding: 2,
                    backgroundColor: "yellow.300",
                    color: "black",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    width: "50%",
                    height: "40px",
                })}
            >
                Pokemon index
            </button>

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
