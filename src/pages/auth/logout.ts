
import type { APIRoute } from "astro";
import { SPOTIFY_TOKEN_COOKIE_NAME } from "../../store/auth.ts";

export const prerender = false;

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(SPOTIFY_TOKEN_COOKIE_NAME, {
    path: '/'
  });

  return redirect('/', 302);
}
