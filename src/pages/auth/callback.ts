import type { APIRoute } from "astro";
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, APP_BASE_URL } from "astro:env/server";
import { SPOTIFY_TOKEN_COOKIE_NAME, type TokenStorage } from "../../store/auth.ts";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const code = new URL(request.url).searchParams.get('code');

  if (!code) {
    throw new Error('Code required');
  }

  const searchParams = new URLSearchParams();
  searchParams.set('code', code);
  searchParams.set('redirect_uri', `${APP_BASE_URL}/auth/callback`);
  searchParams.set('grant_type', 'authorization_code')

  const authOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: searchParams
  };

  return fetch('https://accounts.spotify.com/api/token', authOptions)
    .then(response => response.json())
    .then(body => {
      if (body.access_token) {
        cookies.set(SPOTIFY_TOKEN_COOKIE_NAME, body as TokenStorage, {
          path: '/'
        });

        return redirect('/', 302);
      }

      return new Response('Error retrieving access token')
    })
    .catch(error => {
      console.log({ error })
      return new Response('Error retrieving access token')
    });
}
