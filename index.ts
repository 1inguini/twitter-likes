import fetch from "node-fetch";
import { TwitterOpenApi } from "twitter-openapi-typescript";
import * as secret from "./secret/index.js";

const api = new TwitterOpenApi({ fetchApi: fetch as any });
const client = await api.getClientFromCookies(
  secret.csrfToken,
  secret.authToken,
);
const response = await client.getUserApi().getUserByScreenName({
  screenName: "1inguini",
});
console.log(response.data.user.legacy.screenName);
console.log(
  `followCount: ${response.data.user.legacy.friendsCount} followersCount: ${response.data.user.legacy.followersCount}`,
);
