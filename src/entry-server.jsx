import { renderToString } from "react-dom/server";
import App from "./app";
import "dotenv/config.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nikeService from "./service/nike";
import stravaService from "./service/strava";

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Auth in Nike
app.post("/auth/nike", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await nikeService.getNikeToken(email, password);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: "Unable to authorize Nike" });
  }
});

// Getting activities from Nike
app.get("/nike/activities", async (req, res) => {
  const { token } = req.query;
  try {
    const activities = await nikeService.fetchNikeActivities(token);
    res.json(activities);
  } catch (error) {
    res.status(400).json({ error: "Unable to load activities from Nike" });
  }
});

// Authorization in Strava
app.get("/auth/strava", (req, res) => {
  const url = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${process.env.BASE_URL}/strava/callback&scope=activity:write`;
  res.redirect(url);
});

// Callback Strava OAuth
app.get("/strava/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const tokenData = await stravaService.getStravaToken(code);
    res.json(tokenData);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error occured during authorization in Strava" });
  }
});

// Export activities in Strava
app.post("/export/strava", async (req, res) => {
  const { stravaToken, activities } = req.body;
  try {
    const results = [];
    for (const activity of activities) {
      const result = await stravaService.createStravaActivity(
        stravaToken,
        activity
      );
      results.push(result);
    }
    res.json(results);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Error occured during exporting activities in Strava" });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server listening to port ${PORT}`));

export const render = () => {
  return renderToString(<App />);
};
