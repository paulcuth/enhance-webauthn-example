import { generateRegistrationOptions } from "@simplewebauthn/server";
import arc from "@architect/functions";

const client = await arc.tables();
const users = client.users;

/*******************************************************************************
  GET /auth/sign-up
 ******************************************************************************/

export async function get(req) {
  const { error, username, name, ...session } = req.session;

  return {
    session,
    json: { username, name, error },
  };
}

/*******************************************************************************
  POST /auth/sign-up
 ******************************************************************************/

export async function post(req) {
  const { body, session } = req;
  const { username, name } = body;

  // Check user doesn't exist already
  const existingUser = await users.get({ username });
  if (existingUser != null) {
    session.error = "Username is already taken. Please choose another";
    session.username = username;
    session.name = name;
    return {
      session,
      location: "/auth/sign-up",
    };
  }

  // Generate WebAuthn registration options
  const options = await generateRegistrationOptions({
    rpName: process.env.RP_NAME,
    rpID: process.env.RP_ID,
    userID: new global.Uint8Array(Buffer.from(username)),
    userName: username,
    attestationType: "indirect",
    authenticatorSelection: {
      userVerification: "required",
    },
    supportedAlgorithmIDs: [-7, -257],
  });

  // Store the challenge in the session for verification later
  session.challenge = options.challenge;

  // Store the feedback to the UI
  session.options = options;
  session.user = { username, name };

  return {
    session,
    location: "/auth/sign-up/verify",
  };
}
