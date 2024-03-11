'use server';
import { clerkClient, currentUser } from '@clerk/nextjs/server';
import { generateRegistrationOptions } from '@simplewebauthn/server';
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/types';
import { PassKey } from '@/features/types';
import { RP_ID, RP_NAME } from '@/features/constants';

export async function createRegistrationOptions(): Promise<PublicKeyCredentialCreationOptionsJSON> {
  const user = await currentUser();
  if (!user || !user.username) {
    throw new Error('No user found');
  }
  // Generate WebAuthn registration options
  const userMetadata = user.privateMetadata;
  const userPassKeys = userMetadata.passKeys as PassKey[] || [];
  const options = await generateRegistrationOptions({
    rpName: RP_NAME,
    rpID: RP_ID,
    userID: user.id,
    userName: user.username,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'preferred',
      userVerification: 'preferred',
      authenticatorAttachment: 'platform',
    },
    excludeCredentials: userPassKeys.map((passKey) => ({
      id: passKey.credentialId,
      type: 'public-key',
    })),
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

