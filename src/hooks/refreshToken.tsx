import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { REACT_APP_API_GATEWAY_URL, ROUTES } from '@config/constant';
import { GENERATE_REFRESH_TOKEN } from '@framework/graphql/mutations/generateToken';
import { timeComparisonFun } from '@utils/helpers';
import DecryptionFunction from '@services/decryption';
import EncryptionFunction from '@services/encryption';
/**
 * Method used to generate refresh token
 */
const useRefreshToken = () => {
	const httpLink = createHttpLink({
		uri: REACT_APP_API_GATEWAY_URL,
	});
	const client = new ApolloClient({
		link: httpLink,
		cache: new InMemoryCache(),
	});
	const encryptedToken = localStorage.getItem('refreshToken') as string;
	const token = encryptedToken && DecryptionFunction(encryptedToken);
	const encryptedExpireTime = localStorage.getItem('expireTime') as string;
	const expireTimestamp = encryptedToken && DecryptionFunction(encryptedExpireTime);
	if (timeComparisonFun(expireTimestamp)) {
		return client
			.mutate({
				mutation: GENERATE_REFRESH_TOKEN,
				variables: {
					refreshToken: token,
				},
			})
			.then((response) => {
				const newToken = response?.data?.generateRefreshToken?.data?.token;
				const newExpireTimeOfData = response?.data?.generateRefreshToken?.data?.expiresAt;
				localStorage.setItem('expireTime', EncryptionFunction(newExpireTimeOfData));
				localStorage.setItem('authToken', EncryptionFunction(newToken));
			})
			.catch(() => {
				window.location.href = `/${ROUTES.login}`;
			});
	}
};

export default useRefreshToken;
