# twitter-likes

[無為](https://github.com/muimui20080903)がtwitterでいいねした画像をダウンロードしたいと [TwitterSavpic](https://github.com/muimui20080903/TwitterSavpic) を作っていたので参考になるように作ってみた。

実行の仕方

``` sh
pnpm install
pnpm tsc
pnpm node dist/index.js
```

`secret/index.ts` の中身

``` javascript
export const authToken = "<authToken>";
export const csrfToken = "<ct0>";
```

公開アカウントのいいね見るだけならログインする必要ないかも
