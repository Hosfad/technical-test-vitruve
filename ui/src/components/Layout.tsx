import React from "react";
import { center } from "../../styled-system/patterns/center";
import { css } from "../../styled-system/css";

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div
            className={css({
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            })}
        >
            <div
                className={`${center({
                    display: "flex",
                    flexDir: "column",
                    gap: 8,
                    padding: "4",
                    width: "50%",
                    marginX: "auto",
                })} form-mobile`}
            >
                {children}
            </div>
        </div>
    );
}

export default Layout;
