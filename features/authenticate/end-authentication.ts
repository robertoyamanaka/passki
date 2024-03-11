"use server";
import { clerkClient } from "@clerk/nextjs";
import {
  AuthenticationResponseJSON,
  AuthenticatorDevice,
} from "@simplewebauthn/types";
import {
  base64URLStringToUint8Array,
  findPassKeyByCredentialId,
} from "./utils";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { RP_ID, RP_ORIGIN } from "../constants";
import { PassKey } from "../types";
import { createSignInToken } from "./create-sign-in-token";

export async function endAuthentication(
  authenticationResponseJSON: AuthenticationResponseJSON
) {
  const { id, response } = authenticationResponseJSON;
  const { userHandle } = response; // This is the user ID
  console.log("userHandle", userHandle);
  if (!userHandle) return;
  const user = await clerkClient.users.getUser(userHandle);
  const expectedChallenge =
    (user.privateMetadata.latestPassKeyChallenge as string) || "";
  const credentialId = base64URLStringToUint8Array(id);
  const userPassKeys = (user.privateMetadata.passKeys as PassKey[]) || [];
  if (!userPassKeys) return;
  const passKey = findPassKeyByCredentialId(credentialId, userPassKeys);
  if (!passKey) return "";
  const credentialPublicKey = passKey.credentialPublicKey as Uint8Array;
  const credentialID = passKey.credentialId;
  // You may have issues with this authenticator
  // by getting "no data" make sure your types are correct.
  // That is why the extra casting
  const authenticator: AuthenticatorDevice = {
    credentialPublicKey: new Uint8Array(Object.values(credentialPublicKey)),
    credentialID: new Uint8Array(Object.values(credentialID)),
    counter: passKey.counter,
    transports: passKey.transports,
  };

  try {
    const verification = await verifyAuthenticationResponse({
      response: authenticationResponseJSON,
      expectedChallenge,
      expectedOrigin: RP_ORIGIN,
      expectedRPID: RP_ID,
      authenticator,
    });
    console.log("verification response", verification);
    if (verification.verified) {
      const newSignInToken = await createSignInToken(user.id);
      return newSignInToken;
    }
  } catch (error) {
    console.error(error);
    return;
  }
}
