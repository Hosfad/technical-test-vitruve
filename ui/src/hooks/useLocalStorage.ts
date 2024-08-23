import { useEffect, useState } from "react";

import { get, set } from "idb-keyval";

export const useLocalStorage = <T>(
    key: string,
    initialValue: T
): [T, (value: T) => void] => {
    const [storedValue, setStoredValue] = useState(initialValue);

    useEffect(() => {
        // Retrieve from IndexedDB
        const fetchValue = async () => {
            const item = await get(key);
            if (item !== undefined) {
                setStoredValue(item);
            }
        };

        fetchValue();
    }, [key]);

    const setValue = async (value: T) => {
        setStoredValue(value);
        await set(key, value);
    };

    return [storedValue, setValue];
};
