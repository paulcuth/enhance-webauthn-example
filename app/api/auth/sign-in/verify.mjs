import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import arc from "@architect/functions";

const client = await arc.tables();
const users = client.users;

/*******************************************************************************
  GET /auth/sign-in/verify
 ******************************************************************************/

export async function get(req) {
  const { options, username, ...session } = req.session;

  return {
    session,
    json: { options, username },
  };
}

/*******************************************************************************
  POST /auth/sign-in/verify
 ******************************************************************************/

export async function post(req) {
  const { session, body } = req;
  const { username, assertionResponse } = body;
  const expectedChallenge = session.challenge;

  // Check user exists
  const existingUser = await users.get({ username });
  if (!existingUser?.credential) {
    throw new Error("Username not found");
  }

  // Check credentials
  const credentialID = existingUser.credential.id;
  if (assertionResponse.id !== credentialID) {
    throw new Error("Credentials do not match");
  }

  // Verify
  const credentialPublicKey = global.Uint8Array.from(
    Buffer.from(existingUser.credential.publicKey, "base64")
  );
  const verification = await verifyAuthenticationResponse({
    response: assertionResponse,
    expectedChallenge,
    expectedOrigin: process.env.ORIGIN,
    expectedRPID: process.env.RP_ID,
    authenticator: {
      credentialPublicKey,
      credentialID,
      counter: 0,
    },
  });

  if (!verification.verified) {
    throw new Error("Verification failed!");
  }

  // Sign in
  // eslint-disable-next-line
  const { credential, ...user } = existingUser;
  session.user = user;

  return {
    session,
    json: { success: true, user },
  };
}
