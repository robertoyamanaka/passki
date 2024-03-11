'use server';
import { clerkClient } from '@clerk/nextjs/server';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/types';
import { RP_ID } from '@/features/constants';

export async function createAuthenticationOptions(username:string): Promise<PublicKeyCredentialRequestOptionsJSON> {
  console.log('username input', username);
  if (!username) {
    throw new Error('No username provided for authentication options.');
  }
  const usernames = [username]

  const possibleUsers = await clerkClient.users.getUserList({ username:usernames });
  // A reasonable assumption since usernames should be unique
  const user = possibleUsers[0]

  // Generate WebAuthn authentication options
  const userMetadata = user.privateMetadata;
  const options = await generateAuthenticationOptions({
    rpID: RP_ID,
    userVerification: 'preferred',
  });

  // Update the latest challenge to prevent replay attacks
  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata:{
      ...userMetadata,
      latestPassKeyChallenge: options.challenge,
    }
  });
  return options
}
