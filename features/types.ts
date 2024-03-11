export type PassKey = {
  credentialId: Uint8Array;
  credentialPublicKey: Uint8Array;
  counter: number;
  credentialDeviceType: string;
  credentialBackedUp: boolean;
  transports: Transport[];
  createdTs: number;
};

export type Transport =
  | 'ble'
  | 'cable'
  | 'hybrid'
  | 'internal'
  | 'nfc'
  | 'smart-card'
  | 'usb';