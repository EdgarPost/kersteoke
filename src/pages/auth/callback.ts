import { setToken, TokenStorage } from "../../store/auth.ts";

export const prerender = false;

const SPOTIFY_CLIENT_ID = import.meta.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = import.meta.env.SPOTIFY_CLIENT_SECRET;

console.log({ SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET })

export async function GET({ request, redirect }) {
  const code = new URL(request.url).searchParams.get('code');
  const authOptions: RequestIn = {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + (new Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      code: code,
      redirect_uri: "http://localhost:4321/auth/callback",
      grant_type: 'authorization_code'
    }),
  };

  return fetch('https://accounts.spotify.com/api/token', authOptions)
    .then(response => response.json())
    .then(body => {
      console.log(body);
      if (body.access_token) {
        setToken(body as TokenStorage);

        return redirect('/', 302);
      } else {

        return new Response(
          'Error retrieving access token')
      }
    })
    .catch(error => {
      console.error('Error:', error);
      return new Response(
        'Error retrieving access token')
    });
}
