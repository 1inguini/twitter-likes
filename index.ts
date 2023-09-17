import fetch from "node-fetch";
import { TwitterOpenApi } from "twitter-openapi-typescript";
import * as secret from "./secret/index.js";
import { createWriteStream, mkdir } from "fs";
import { basename, resolve } from "path";

const downloadDir = "downloads"; // 画像/動画がダウンロードされるフォルダ
const screenName = "1inguini"; // 自分のアカウントid

// セットアップ
const api = new TwitterOpenApi({ fetchApi: fetch as any });
const client = await api.getClientFromCookies(
  secret.csrfToken, // Cookie の ct0
  secret.authToken, // Cookie の authToken
);

// Api で扱う id を自分の アカウントid から取得
const userId =
  (await client.getUserApi().getUserByScreenName({ screenName })).data.user
    .restId;

// 最新の like をいくらか取得
const likes = await client.getTweetApi().getLikes({ userId });

// like の配列を走査
for (const like of likes.data.data) {
  // `undefiend` を扱わなくて済むように `??` で `undefiend` のとき空の配列に置き換える
  const medias = like.tweet.legacy.entities.media ?? [];
  // media があればフォルダを作る
  if (medias.length > 0) {
    mkdir(
      resolve(downloadDir, like.tweet.restId), // `resolve` で絶対パスに
      { recursive: true }, // 再帰的にフォルダを作成するようにするとすでにフォルダがあってもエラーにならない
      (err) => {
        if (err) throw err;
      },
    );
  }
  // 画像/動画の情報を走査
  for await (const media of medias) {
    // tweet の id と画像の url の対応をコマンドラインに出力
    console.log(like.tweet.restId, media.mediaUrlHttps);
    // 画像を http GET で取得
    const response = await fetch(media.mediaUrlHttps);
    // `fetch` だとレスポンスボディは `ReadableStream` というものになる
    await response.body?.pipe(
      // レスポンスボディの `ReadableStream` を `createWriteStream` で作った `WriteableStream` に食わせる
      createWriteStream(
        resolve(downloadDir, like.tweet.restId, basename(media.mediaUrlHttps)),
      ),
    );
  }
}
