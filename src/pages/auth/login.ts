var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export async function GET({ params, redirect }) {
  var scope = "streaming \
               user-read-email \
               user-read-private"

  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: import.meta.env.SPOTIFY_CLIENT_ID,
    scope: scope,
    redirect_uri: "https://kersteoke.vercel.app/auth/callback",
    state: state
  });

  return redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString(), 302);
}
