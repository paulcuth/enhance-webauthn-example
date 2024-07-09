export default function SignIn({ html, state }) {
  const { error, username = "" } = state.store;

  return html`
    <style>
      form {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      label,
      button {
        margin-top: 8px;
      }
      p.error {
        color: #ff7777;
        font-weight: 500;
      }
    </style>

    <main>
      <h1>Sign in</h1>
      ${error && `<p class="error">${error}</p>`}
      <p>Enter your username to sign in</p>
      <form method="POST" action="/auth/sign-in">
        <label for="username">Username</label>
        <input
          type="text"
          name="username"
          value="${escape(username)}"
          required
        />
        <button type="submit">Sign in</button>
      </form>
    </main>
  `;
}
