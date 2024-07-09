export default function Index({ html, state }) {
  const { user } = state.store;

  if (user == null) {
    return html`
      <main>
        <h1>Hello 👋</h1>
        <p>You're not signed in. Please sign in or sign up</p>
        <nav>
          <ul>
            <li><a href="/auth/sign-in">Sign in</a></li>
            <li><a href="/auth/sign-up">Sign up</a></li>
          </ul>
        </nav>
      </main>
    `;
  }

  return html`
    <main>
      <h1>Hello ${user.name} 👋</h1>
      <p>Welcome. You are signed in.</p>
      <nav>
        <ul>
          <li><a method="post" href="/auth/sign-out">Sign out</a></li>
        </ul>
      </nav>
    </main>
  `;
}
