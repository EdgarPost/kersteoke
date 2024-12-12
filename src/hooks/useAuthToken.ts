import { useEffect, useState } from "react";
import Cookies from 'universal-cookie'
import { SPOTIFY_TOKEN_COOKIE_NAME, type TokenStorage } from "../store/auth";

const cookies = new Cookies(null, { path: '/' });

export const useAuthToken = (): string | undefined => {
  const [token, setToken] = useState<string>();

  useEffect(() => {
    const cookie = cookies.get(SPOTIFY_TOKEN_COOKIE_NAME) as TokenStorage;
    setToken(cookie.access_token);
  })

  return token;
}
