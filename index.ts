import { auth, Client } from "twitter-api-sdk";
import * as secret from "./secret/index.js";
import express from "express";

const authClient = new auth.OAuth2User({
  client_id: secret.id,
  client_secret: secret.secret,
  callback: "http://127.0.0.1:3000/callback",
  scopes: ["tweet.read", "users.read"],
});

const app = express();
const STATE = "my-state";

app.get("/callback", async function (req, res) {
  try {
    const { code, state } = req.query;
    if (state !== STATE) return res.status(500).send("State isn't matching");
    await authClient.requestAccessToken(code as string);
    res.redirect("/tweets");
  } catch (error) {
    console.log(error);
  }
});

app.get("/login", async function (req, res) {
  const authUrl = authClient.generateAuthURL({
    state: STATE,
    code_challenge_method: "s256",
  });
  res.redirect(authUrl);
});

app.get("/tweets", async function () {
  const client = new Client(authClient);
  const me = await client.users.findMyUser();
  console.log(me);
});

app.get("/revoke", async function (req, res) {
  try {
    const response = await authClient.revokeAccessToken();
    res.send(response);
  } catch (error) {
    console.log(error);
  }
});

app.listen(3000, async () => {
  console.log(`Go here to login: http://127.0.0.1:3000/login`);
});
