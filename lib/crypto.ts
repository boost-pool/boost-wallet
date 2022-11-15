import cryptoRandomString from 'crypto-random-string';
import { encrypt_with_password } from '@dcspark/cardano-multiplatform-lib-browser';

export const encryptData = async (
  plaintextHex: string,
  secretKey: string,
): Promise<string> => {
  const secretKeyHex = Buffer.from(secretKey, 'utf8').toString('hex')
  const saltHex = cryptoRandomString(64);
  const nonceHex = cryptoRandomString(64);

  return encrypt_with_password(
    secretKeyHex,
    saltHex,
    nonceHex,
    plaintextHex,
  );
};