import { verifyRegistrationResponse } from "@simplewebauthn/server";
import arc from "@architect/functions";

const client = await arc.tables();
const users = client.users;

/*******************************************************************************
  GET /auth/sign-up/verify
 ******************************************************************************/

export async function get(req) {
  const { options, user, ...session } = req.session;

  return {
    session,
    json: { options, user },
  };
}

/*******************************************************************************
  POST /auth/sign-up/verify
 ******************************************************************************/

export async function post(req) {
  const { session, body } = req;
  const { user, attestationResponse } = body;
  const expectedChallenge = session.challenge;

  // Verify
  const verification = await verifyRegistrationResponse({
    response: attestationResponse,
    expectedChallenge,
    expectedOrigin: process.env.ORIGIN,
    expectedRPID: process.env.RP_ID,
  });

  if (!verification.verified) {
    throw new Error("Verification failed!");
  }

  // Get credential
  const { credentialID, credentialPublicKey } = verification.registrationInfo;
  const credential = {
    id: credentialID,
    publicKey: Buffer.from(credentialPublicKey).toString("base64"),
  };

  // Store new user with credential
  users.put({ ...user, credential });

  // Sign in
  session.user = user;

  return {
    session,
    json: { success: true, user },
  };
}
