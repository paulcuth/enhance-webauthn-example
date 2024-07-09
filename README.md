# enhance-webauthn-example

A minimal implementation using [WebAuthn](https://www.w3.org/TR/webauthn/) to register and authenticate users in [Enhance](https://enhance.dev).

## Getting started

```
git clone git@github.com:paulcuth/enhance-webauthn-example.git
cd enhance-webauthn-example
npm install
cp ./.env.local ./.env
npm start
```

Then navigate to http://localhost:3333. From there you should be able to sign up, sign out, and sign in again.

When deployed, try signing up on your mobile, then signing in on desktop with the same username, and selecting to authenticate with a device. ✨

## Feeding back

PRs are welcome. If you have any other feedback, you can find me on Mastodon at [@paulcuth@mastodon.social](https://mastodon.social/@paulcuth).
