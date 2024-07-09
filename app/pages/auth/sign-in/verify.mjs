export default function VerifySignIn({ html, state }) {
  const { options, username } = state.store;

  return html`
    <noscript>
      <h1>Unable to authenticate</h1>
      <p>Authentication requires JavaScript.</p>
    </noscript>

    <script type="module">
      import { startAuthentication } from "/_public/simplewebauthn-browser.mjs";

      const options = ${JSON.stringify(options)};
      const assertionResponse = await startAuthentication(options);

      const verifyResponse = await fetch("/auth/sign-in/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: "${username}",
          assertionResponse,
        }),
      });

      if (verifyResponse.ok) {
        window.location.replace("/");
      } else {
        alert("Sign-in failed!");
        window.location.replace("/auth/sign-in");
      }
    </script>
  `;
}
