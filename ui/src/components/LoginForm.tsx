import { del } from "idb-keyval";
import React from "react";
import { Link } from "react-router-dom";
import { css } from "../../styled-system/css";
import { useLocalStorage } from "../hooks/useLocalStorage";
import Input from "./Input";
import Layout from "./Layout";

function LoginForm() {
    const [cachedUser, setCachedUser] = useLocalStorage("user", null);

    const [errMessage, setErrMessage] = React.useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const {
            email: { value: email },
            password: { value: password },
        } = e.currentTarget;

        if (!email || !password) {
            console.error("Email and password are required");
            return;
        }
        const res = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            const data = await res.json();
            setCachedUser(data);
            await del("pokemon");

            if (window.location.pathname === "/dashboard") {
                window.location.reload();
            } else {
                window.location.href = "/dashboard";
            }
        } else {
            alert("Invalid email or password");
            setErrMessage("Invalid email or password");
        }
    };

    return (
        <Layout>
            <h1 id="login-page-header" className={css({ color: "yellow.300" })}>
                Login to your pokedex account
            </h1>

            {errMessage && (
                <p className={css({ color: "red.400" })}>{errMessage}</p>
            )}
            <form
                className={css({ display: "grid", gap: 8, width: "full" })}
                onSubmit={handleSubmit}
            >
                <Input
                    type="email"
                    name="email"
                    required
                    placeholder="Email"
                ></Input>

                <Input
                    type="password"
                    name="password"
                    required
                    placeholder="Password"
                ></Input>

                <button
                    className={css({
                        padding: 8,
                        backgroundColor: "yellow.300",
                        color: "black",
                        border: "1px solid",
                        borderColor: "yellow.300",
                        borderRadius: 8,
                        cursor: "pointer",
                        width: "100%",
                        height: "50px",
                    })}
                    type="submit"
                >
                    Login
                </button>
            </form>
            <p>
                You don't have an account?{" "}
                <Link to={"/signup"}>
                    <span className={css({ color: "yellow.300" })}>
                        Sign up here
                    </span>
                </Link>
            </p>
        </Layout>
    );
}

export default LoginForm;
