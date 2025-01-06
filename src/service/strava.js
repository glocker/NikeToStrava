import { post } from "axios";

// Getting Strava access token in OAuth
async function getStravaToken(code) {
  const url = "https://www.strava.com/oauth/token";
  const response = await post(url, {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
  });
  return response.data;
}

// Creating activity in Strava
async function createStravaActivity(accessToken, activity) {
  const url = "https://www.strava.com/api/v3/activities";
  const response = await post(
    url,
    {
      name: activity.name,
      type: "Run",
      start_date_local: activity.start_time,
      elapsed_time: activity.duration,
      distance: activity.distance,
    },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  return response.data;
}

export default { getStravaToken, createStravaActivity };
