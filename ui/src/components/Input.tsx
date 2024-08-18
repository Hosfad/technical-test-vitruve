import React from "react";
import { css } from "../../styled-system/css";

function Input({
    type,
    name,
    defaultValue,
    placeholder,
    required,
    step,
    onChange,
}: {
    type: "text" | "email" | "password" | "number";
    name: string;
    defaultValue?: string | number;
    placeholder?: string;
    step?: string;
    required?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    return (
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
            placeholder={placeholder || ""}
            defaultValue={defaultValue}
            id={name}
            name={name}
            type={type}
            required={required}
            onChange={onChange}
            step={type === "number" && step ? step : undefined}
            pattern={type === "number" ? "[0-9]*" : undefined}
            inputMode={type === "number" ? "numeric" : undefined}
        ></input>
    );
}

export default Input;
