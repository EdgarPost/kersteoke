export type TokenStorage = {
  access_token: string,
  token_type: string,
  expires_in: number,
  expiration_date: number,
  scope: string,
  refresh_token: string,
}

let token: TokenStorage | null = null;

export const SPOTIFY_TOKEN_COOKIE_NAME = 'spotify_token';

export const getToken = (): TokenStorage | null => token;

export const setToken = (newToken: TokenStorage) => {
  token = {
    ...newToken,
    expiration_date: Date.now() + newToken.expires_in * 1000,
  };
}
