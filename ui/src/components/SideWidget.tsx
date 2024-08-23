import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { css } from "../../styled-system/css";

function SideWidget({
    children,
    isOpen,
    setIsOpen,
}: {
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const widgetRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                widgetRef.current &&
                !widgetRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, setIsOpen]);

    const initial = { opacity: 0, x: 300 };
    const animate = { opacity: 1, x: 0 };
    const exit = { opacity: 0, x: 300 };

    const sideWidgetStyle = css({
        position: "fixed",
        top: 10,
        right: 0,
        width: "300px",
        height: "100%",
        boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)",
        backgroundColor: "rgba(13,13,13,255)",
        zIndex: 999,
        padding: "20px",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
            display: "none",
        },
    });

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    ref={widgetRef}
                    className={sideWidgetStyle}
                >
                    <div
                        className={css({
                            display: "flex",
                            position: "relative",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "between",
                            marginTop: 8,
                        })}
                    >
                        <motion.div
                            onClick={() => setIsOpen(false)}
                            className={css({
                                position: "absolute ",
                                right: 0,
                                top: 4,
                                color: "yellow.300",
                                border: "1px solid",
                                borderColor: "yellow.300",
                                borderRadius: "10%",
                                padding: 1,
                                paddingX: 3,
                                cursor: "pointer",
                                marginTop: -5,
                            })}
                        >
                            x
                        </motion.div>
                    </div>

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
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default SideWidget;
