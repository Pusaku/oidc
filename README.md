# Sveltekit MS EntraID OIDC認証パーツ
## 設定
1. sveltekitをインストール
2. MS EntraIDでアプリ登録、テナントIDとかredirecturlをコピー
3. .env.developmentに設定
    ```
    VITE_OIDC_ROOT_URL="https://login.microsoftonline.com/{テナントID}/v2.0/.well-known/openid-configuration"
    VITE_CLIENT_ID="{クライアントID}"
    VITE_REDIRECT_URL="{リダイレクトurl}"
    VITE_PUBLIC_KEY="{publickey.pem}"
    VITE_PRIVATE_KEY="{privatekey.pem}"
    ```
## 概要
- /login    ログイン、FORM ACTION か /login/msへのリダイレクトで認証処理
- /callback 認証後にcallbackされる処理



ーーー


Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
