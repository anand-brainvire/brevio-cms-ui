import { REACT_APP_ENCRYPTION_DECRYPTION_KEY } from '@config/constant';
import { WordArray } from '@type/common';
import * as CryptoJS from 'crypto-js';
/**
 *
 * @param text
 * @returns a encrypetd value
 */
const EncryptionFunction = (text: string | WordArray) => {
	const key = REACT_APP_ENCRYPTION_DECRYPTION_KEY as WordArray | string;
	return key && text && CryptoJS.AES.encrypt(JSON.stringify(text), key).toString();
};
export default EncryptionFunction;
