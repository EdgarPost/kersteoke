import {useEffect, useState} from "react";

export const useAuthToken = (): string | undefined => {
    const [token, setToken] = useState();

    useEffect(() => {
        const fetchToken = async () => {
            const response = await fetch('/auth/token');
            const json = await response.json();

            setToken(json.token);
        }

        void fetchToken();
    })

    return token;
}