import { PassKey } from "../types";

export function base64URLStringToUint8Array(
  base64URLString: string
): Uint8Array {
  // Implementation of this conversion depends on how the string is encoded
  // Here is a basic implementation
  const padding = "=".repeat((4 - (base64URLString.length % 4)) % 4);
  const base64 = (base64URLString + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

function uint8ArraysAreEqual(a: Uint8Array, b: Uint8Array) {
  if (a.byteLength !== b.byteLength) return false;
  for (let i = 0; i < a.byteLength; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

  export function findPassKeyByCredentialId(
    credentialId: Uint8Array,
    passKeys: PassKey[]
  ): PassKey | undefined {
    // Convert any credential IDs that are not already Uint8Arrays
    const convertedPassKeys = passKeys.map((pk) => {
      return {
        ...pk,
        credentialId: pk.credentialId instanceof Uint8Array
          ? pk.credentialId
          : new Uint8Array(Object.values(pk.credentialId)),
      };
    });
  
    return convertedPassKeys.find(pk =>
      uint8ArraysAreEqual(pk.credentialId, credentialId)
    );
  }