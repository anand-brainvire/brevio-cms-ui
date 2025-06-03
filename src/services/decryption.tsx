import { REACT_APP_ENCRYPTION_DECRYPTION_KEY } from '@config/constant';
import { CipherParams, WordArray } from '@type/common';
import * as CryptoJS from 'crypto-js';
/**
 *
 * @param text
 * @returns a decrypted value
 */
const DecryptionFunction = (text: string | CipherParams) => {
	const key = REACT_APP_ENCRYPTION_DECRYPTION_KEY as WordArray | string;
	return key && text && JSON.parse(CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8));
};
export default DecryptionFunction;
