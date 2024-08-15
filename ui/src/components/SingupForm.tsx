import React from "react";
import { Link } from "react-router-dom";
import { css } from "../../styled-system/css";
import { center } from "../../styled-system/patterns";

function SingupForm() {

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const email = e.currentTarget.email.value;
        const password = e.currentTarget.password.value;
        const username = e.currentTarget.username.value;
        console.log("submitting form" , email, password, username);
    };


    return (
        <div
            className={css({
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            })}
        >
            <form
            onSubmit={handleSubmit}
                className={center({
                    display: "flex",
                    flexDir: "column",
                    gap: "4",
                    padding: "4",
                    width: "50%",
                    marginX: "auto",
                })}
            >
                <h1 className={css({ color: "yellow.300" })}>Sign up for an account</h1>

                <input
                    className={css({
                        padding: "4",
                        width: "100%",
                        border: "1px solid",
                        borderColor: "yellow.300",
                        _placeholder: {
                            color: "yellow.300",
                        },
                        borderRadius: "4",
                    })}
                    placeholder="Username"
                    id="username"
                    name="username"
                    type="text"
                ></input>

                <input
                    className={css({
                        padding: "4",
                        width: "100%",
                        border: "1px solid",
                        borderColor: "yellow.300",
                        _placeholder: {
                            color: "yellow.300",
                        },
                        borderRadius: "4",
                    })}
                    placeholder="Email"
                    id="email"
                    name="email"
                    type="email"
                ></input>

                <input
                    className={css({
                        padding: "4",
                        width: "100%",
                        border: "1px solid",
                        borderColor: "yellow.300",
                        _placeholder: {
                            color: "yellow.300",
                        },
                        borderRadius: "4",
                    })}
                    placeholder="Password"
                    id="password"
                    name="password"
                    type="password"
                ></input>


                <button className={css({
                    padding: 8 ,
                    backgroundColor: "yellow.300",
                    color: "black",
                    border: "1px solid",
                    borderColor: "yellow.300",
                    borderRadius: 8,
                    cursor: "pointer",
                    width: "100%",
                    height: "50px",
                })}>
                    Singup 
                </button>
            </form>
        </div>
    );
}

export default SingupForm;
