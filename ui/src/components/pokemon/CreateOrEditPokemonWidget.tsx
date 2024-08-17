import { motion } from "framer-motion";
import React from "react";
import { css } from "../../../styled-system/css";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Pokemon, User } from "../../types";
import Input from "../Input";
import SideWidget from "../SideWidget";
import PokemonTypeSelect from "./PokemonTypeSelect";

function CreateOrEditPokemonWidget({ pokemon }: { pokemon?: Pokemon }) {
    const [isOpen, setIsOpen] = React.useState(false);

    const [currentPokemon, setCurrentPokemon] = React.useState<Pokemon | null>(
        pokemon || null
    );

    const [cachedUser, setCachedUser] = useLocalStorage<User | null>(
        "user",
        null
    );

    const [isEditing, setIsEditing] = React.useState(false);

    const [image, setImage] = React.useState<string | null>(
        pokemon?.sprites.front_default || null
    );

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        if (isEditing) return;
        e.preventDefault();
        // @ts-ignore
        const name = e.currentTarget.name?.value;
        const height = e.currentTarget.height
            ? parseInt(e.currentTarget.height.value)
            : 0;
        const weight = e.currentTarget.weight
            ? parseInt(e.currentTarget.weight.value)
            : 0;
        const types = e.currentTarget.type?.value;

        if (!name || !height || !weight || !types) {
            return alert("All fields are required");
        }

        if (!pokemon && !image) {
            alert("Please upload an image");
            return;
        }

        const data = {
            name,
            height,
            weight,
            types,
            image,
        };
        const url = pokemon
            ? `${import.meta.env.VITE_API_URL}/users/pokemon/${pokemon.id}`
            : `${import.meta.env.VITE_API_URL}/users/pokemon`;

        const method = pokemon ? "POST" : "PUT";
        setIsEditing(true);
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${cachedUser?.accessToken}`,
            },
            body: JSON.stringify(data),
        });
        if (res.ok) {
            const responseData = await res.json();
            setIsOpen(false);
            setCachedUser(responseData.user as User);
            alert("Pokemon created successfully");
            window.location.reload();
        }
        setIsEditing(false);
    }

    async function handleDelete() {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/users/pokemon/${pokemon?.id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${cachedUser?.accessToken}`,
                },
            }
        );
        if (res.ok) {
            const data = await res.json();
            setCachedUser(data);
            setIsOpen(false);
            alert("Pokemon deleted successfully");
            window.location.reload();
        }
    }

    return (
        <>
            <motion.div
                className={css({
                    alignItems: "center",
                    display: "flex",
                    borderRadius: 4,
                    justifyContent: "center",
                    border: "1px solid",
                    borderColor: "yellow.300",
                    cursor: "pointer",
                })}
                whileHover={{ scale: 1.1 }}
                onClick={() =>
                    cachedUser
                        ? setIsOpen(true)
                        : alert("You must be logged in to create a new pokemon")
                }
            >
                {pokemon ? "Edit " + pokemon.name : "Create a new pokemon"}
            </motion.div>

            <SideWidget isOpen={isOpen} setIsOpen={setIsOpen}>
                <h1>
                    {pokemon ? "Edit " + pokemon.name : "Create a new pokemon"}
                </h1>
                <form
                    className={css({
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        marginTop: 20,
                    })}
                    onSubmit={handleSubmit}
                >
                    <Input
                        type="text"
                        name="name"
                        defaultValue={currentPokemon?.name || ""}
                        placeholder="Name"
                        required
                    ></Input>

                    <div>
                        <p>Height</p>
                        <Input
                            type="number"
                            name="height"
                            placeholder="Height"
                            defaultValue={currentPokemon?.height || ""}
                        ></Input>
                    </div>

                    <div>
                        <p>Weight</p>
                        <Input
                            type="number"
                            name="weight"
                            placeholder="Weight"
                            defaultValue={currentPokemon?.height || ""}
                        ></Input>
                    </div>
                    <div>
                        <p>Type</p>
                        <PokemonTypeSelect></PokemonTypeSelect>
                    </div>

                    <div>
                        <h1>Image</h1>

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
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                document
                                    .querySelector("input[type=file]")
                                    // @ts-ignore
                                    ?.click();
                            }}
                        >
                            Upload image
                        </button>
                        <input
                            type="file"
                            name="image"
                            id="image"
                            style={{ display: "none" }}
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.size > 1_000_000) {
                                    alert("Image must be less than 1mb");
                                    return;
                                }

                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    // @ts-ignore
                                    setImage(e.target.result);
                                };
                                reader.readAsDataURL(file);
                            }}
                        ></input>
                    </div>

                    <div
                        className={css({
                            display: "flex",
                            alignContent: "center",
                            alignItems: "center",
                            gap: 2,
                        })}
                    >
                        <button
                            type="submit"
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
                        >
                            {pokemon ? "Edit pokemon" : "Create pokemon"}

                            {isEditing && "..."}
                        </button>
                        {pokemon?.isCustomPokemon && (
                            <button
                                className={css({
                                    padding: 8,
                                    backgroundColor: "red.400",
                                    color: "black",
                                    border: "1px solid",
                                    borderColor: "red.400",
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    width: "100%",
                                    height: "50px",
                                })}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete();
                                }}
                            >
                                Delete
                                {isEditing && "..."}
                            </button>
                        )}
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <a href="/dashboard">dashboard</a>
                </form>
            </SideWidget>
        </>
    );
}

export default CreateOrEditPokemonWidget;
