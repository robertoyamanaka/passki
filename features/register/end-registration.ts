'use server';

import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { RP_ID, RP_ORIGIN } from '@/features/constants';
import { RegistrationResponseJSON } from '@simplewebauthn/types';
import { PassKey } from '../types';
import { clerkClient, currentUser } from '@clerk/nextjs';

export async function endRegistration(registrationResponseJSON: RegistrationResponseJSON) {
    const user = await currentUser();
    const userMetadata = user?.privateMetadata
    if (!user || !userMetadata) {
      throw new Error('No user found');
    }
    const expectedChallenge = userMetadata.latestPassKeyChallenge as string || ''
    try {
      const verification = await verifyRegistrationResponse({
        response: registrationResponseJSON,
        expectedChallenge,
        expectedOrigin: RP_ORIGIN,
        expectedRPID: RP_ID,
      });
      const { verified, registrationInfo } = verification;
      if (verified && registrationInfo) {
        console.log('Registration verified');
        const {
          credentialPublicKey,
          credentialID,
          counter,
          credentialBackedUp,
        } = registrationInfo;
        const foundTransports = registrationResponseJSON.response.transports;
        const newPassKey:PassKey = {
          credentialId: credentialID,
          credentialPublicKey: credentialPublicKey,
          counter,
          credentialDeviceType: 'singleDevice',
          credentialBackedUp,
          transports: foundTransports || [],
            createdTs: Date.now(),
        }
        // Save the new pass key to the user's private metadata
        const userPassKeys = userMetadata.passKeys as PassKey[] || [];
        await clerkClient.users.updateUserMetadata(user.id, {
          privateMetadata:{
            ...userMetadata,
            passKeys: [...userPassKeys, newPassKey],
          }
        });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }