import {getToken} from "../../store/auth.ts";

export async function GET() {
    const token = getToken();

    if(!token) {
        return new Response(
            JSON.stringify({
                error: "No token found"
            })
        )
    }

    const { access_token, expires_in, expiration_date } = token;

    return new Response(
        JSON.stringify({
            token: access_token,
            expires_in,
            expiration_date
        })
    )
}