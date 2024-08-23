import { ChangeEventHandler } from "react";
import { css } from "../../../styled-system/css";
import { getAllTypes } from "../../utils";

function PokemonTypeSelect({
    incdludeAllTypes,
    handleChange,
}: {
    incdludeAllTypes?: boolean;
    handleChange?: ChangeEventHandler<HTMLSelectElement>;
}) {
    return (
        <select
            className={css({
                padding: 4,
                width: "100%",
                border: "1px solid ",
                borderColor: "yellow.300",
                borderRadius: 4,
            })}
            name="type"
            id="type"
            onChange={handleChange ? handleChange : () => {}}
        >
            {incdludeAllTypes && (
                <option
                    style={{
                        backgroundColor: "black",
                        color: "yellow.300",
                    }}
                    value={undefined}
                >
                    All Types
                </option>
            )}
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
    );
}

export default PokemonTypeSelect;
