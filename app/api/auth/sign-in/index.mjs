import { generateAuthenticationOptions } from "@simplewebauthn/server";
import arc from "@architect/functions";

const client = await arc.tables();
const users = client.users;

/*******************************************************************************
  GET /auth/sign-in
 ******************************************************************************/

export async function get(req) {
  const { error, username, ...session } = req.session;

  return {
    session,
    json: { username, error },
  };
}

/*******************************************************************************
  POST /auth/sign-in
 ******************************************************************************/

export async function post(req) {
  const { body, session } = req;
  const { username } = body;

  // Check user exists
  const existingUser = await users.get({ username });
  if (!existingUser?.credential) {
    session.error = "Username not found";
    session.username = username;
    return {
      session,
      location: "/auth/sign-in",
    };
  }

  // Generate WebAuthn authentication options
  const options = await generateAuthenticationOptions({
    rpID: process.env.RP_ID,
    userVerification: "required",
    allowCredentials: [
      {
        id: existingUser.credential.id,
        transports: [
          "internal",
          "usb",
          "ble",
          "nfc",
          "cable",
          "hybrid",
          "smart-card",
        ],
      },
    ],
  });

  // Store the challenge in the session for verification later
  session.challenge = options.challenge;

  // Store the feedback to the UI
  session.options = options;
  session.username = username;

  return {
    session,
    location: "/auth/sign-in/verify",
  };
}
