import type { APIRoute } from "astro";
import { SPOTIFY_CLIENT_ID, APP_BASE_URL } from "astro:env/server";

const generateRandomString = function (length: number) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const scope =
  "streaming user-read-email user-read-private user-modify-playback-state";

export const GET: APIRoute = async ({ redirect }) => {
  const state = generateRandomString(16);

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: `${APP_BASE_URL}/auth/callback`,
    state: state,
  });

  console.log({ auth_query_parameters });

  return redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString(),
    302,
  );
};
