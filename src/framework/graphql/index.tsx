import { ApolloClient, InMemoryCache, createHttpLink, from, Observable } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { REACT_APP_API_GATEWAY_URL } from '@config/constant';
import { onError } from '@apollo/client/link/error';
import DecryptionFunction from 'src/services/decryption';
import { GENERATE_REFRESH_TOKEN } from './mutations/generateToken';
import EncryptionFunction from '@services/encryption';
import { errorHandler } from '@utils/helpers';
import { MetaRes } from './graphql';

// Define environment variables

// HTTP Link
const httpLink = createHttpLink({
	uri: REACT_APP_API_GATEWAY_URL,
});

// Authentication Link
const authLink = setContext((_, { headers }) => {
	const encryptedToken = localStorage.getItem('authToken');
	const token = encryptedToken ? DecryptionFunction(encryptedToken) : '';
	const encryptedParamToken = localStorage.getItem('param');
	const paramToken = encryptedParamToken ? DecryptionFunction(encryptedParamToken) : '';
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : `Bearer ${paramToken}`,
		},
	};
});

// Error Handling Link
const errorLink = onError(({ graphQLErrors, forward, operation }) => {
	if (graphQLErrors?.length) {
		for (const err of graphQLErrors) {
			if (err.extensions?.code === 'INVALID_TOKEN') {
				const encryptedToken = localStorage.getItem('refreshToken') as string;
				const refreshToken = encryptedToken && DecryptionFunction(encryptedToken);
				// Adjust based on how you store refresh token
				if (!refreshToken) {
					localStorage.removeItem('authToken'); // Clear token
					return;
				}

				return new Observable((observer) => {
					client
						.mutate({
							mutation: GENERATE_REFRESH_TOKEN,
							variables: { refreshToken: refreshToken },
						})
						.then((response) => {
							const newToken = response?.data?.generateRefreshToken?.data?.token;
							localStorage.setItem('authToken', EncryptionFunction(newToken)); // Update token in local storage
							operation.setContext({
								headers: {
									...operation.getContext().headers,
									authorization: `Bearer ${newToken}`,
								},
							});
							forward(operation).subscribe({
								next: observer.next.bind(observer),
								error: observer.error.bind(observer),
								complete: observer.complete.bind(observer),
							});
						})
						.catch(() => {
							localStorage.removeItem('authToken'); // Clear token
						});
				});
			} else {
				errorHandler(err?.extensions?.meta as MetaRes);
			}
		}
	}
});

// Apollo Client
const client = new ApolloClient({
	link: from([authLink, errorLink, httpLink]),
	cache: new InMemoryCache(),
});

export default client;
