import { del } from "idb-keyval";
import React from "react";
import { Link } from "react-router-dom";
import { css } from "../../styled-system/css";
import { useLocalStorage } from "../hooks/useLocalStorage";
import Input from "./Input";
import Layout from "./Layout";

function SingupForm() {
    const [cachedUser, setCachedUser] = useLocalStorage("user", null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const {
            email: { value: email },
            password: { value: password },
            username: { value: username },
        } = e.currentTarget;

        if (!email || !password || !username) {
            return alert("All fields are required");
        }

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/users/signup`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password, username }),
            }
        );

        if (res.ok) {
            const data = await res.json();
            setCachedUser(data);
            await del("pokemon");
            if (window.location.pathname === "/dashboard") {
                window.location.reload();
            } else {
                window.location.href = "/dashboard";
            }
        }
    };

    return (
        <Layout>
            <h1 className={css({ color: "yellow.300" })}>
                Sign up for an account
            </h1>
            <form
                className={css({ display: "grid", gap: 8, width: "full" })}
                onSubmit={handleSubmit}
            >
                <Input
                    type="text"
                    name="username"
                    required
                    placeholder="Username"
                ></Input>

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
                    Sign up
                </button>
            </form>
            <p>
                Already have an account?{" "}
                <Link to={"/login"}>
                    <span className={css({ color: "yellow.300" })}>
                        Login here
                    </span>
                </Link>
            </p>
        </Layout>
    );
}

export default SingupForm;
