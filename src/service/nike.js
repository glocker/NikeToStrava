import { post, get } from "axios";

// Getting Nike bearer token
async function getNikeToken(email, password) {
  const url = "https://unofficial-nike-login-endpoint.com/token"; // Change url
  const response = await post(url, { email, password });
  return response.data.access_token;
}

// Getting activities Nike Run Club
async function fetchNikeActivities(bearerToken) {
  const url = "https://api.nike.com/sport/v3/me/activities";
  const response = await get(url, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  });
  return response.data.activities;
}

export default { getNikeToken, fetchNikeActivities };
