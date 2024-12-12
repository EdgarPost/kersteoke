import type { APIRoute } from "astro";

const generateRandomString = function(length: number) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const scope = "streaming user-read-email user-read-private"

export const GET: APIRoute = async ({ redirect }) => {
  const state = generateRandomString(16);

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: import.meta.env.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: `${import.meta.env.APP_BASE_URL}/auth/callback`,
    state: state
  });

  return redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString(), 302);
}
