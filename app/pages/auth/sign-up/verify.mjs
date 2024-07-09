export default function VerifySignUp({ html, state }) {
  const { options, user } = state.store;

  return html`
    <noscript>
      <h1>Unable to authenticate</h1>
      <p>Authentication requires JavaScript.</p>
    </noscript>

    <script type="module">
      import { startRegistration } from "/_public/simplewebauthn-browser.mjs";

      const options = ${JSON.stringify(options)};
      const attestationResponse = await startRegistration(options);

      const verifyResponse = await fetch("/auth/sign-up/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: ${JSON.stringify(user)},
          attestationResponse,
        }),
      });

      if (verifyResponse.ok) {
        window.location.replace("/");
      } else {
        alert("Sign-up failed!");
        window.location.replace("/auth/sign-up");
      }
    </script>
  `;
}
