export default function SignUp({ html, state }) {
  const { error, username = "", name = "" } = state.store;

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
      <h1>Sign up</h1>
      ${error && `<p class="error">${error}</p>`}
      <p>Pick a username and enter your details.</p>
      <form method="POST" action="/auth/sign-up">
        <label for="username">Username</label>
        <input
          type="text"
          name="username"
          value="${escape(username)}"
          required
        />
        <label for="name">Name</label>
        <input type="text" name="name" value="${escape(name)}" required />
        <button type="submit">Sign up</button>
      </form>
    </main>
  `;
}
