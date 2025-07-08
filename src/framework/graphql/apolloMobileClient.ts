// apolloMobileClient.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { REACT_APP_API_MOBILE_URL } from '@config/constant';
import DecryptionFunction from '@services/decryption';

// Define the mobile API endpoint
const MOBILE_GRAPHQL_API = REACT_APP_API_MOBILE_URL;

const httpLink = createHttpLink({
  uri: MOBILE_GRAPHQL_API,
});

// Set internal header context
const authLink = setContext((_request, previousContext) => {
  const encryptedToken = localStorage.getItem('authToken');
  const token = encryptedToken ? DecryptionFunction(encryptedToken) : '';

  const internalUserId = previousContext?.headers?.['x-internal-user-id'];

  return {
    headers: {
      ...previousContext.headers,
      'x-internal-secret': `Bearer ${token}`,
      ...(internalUserId && { 'x-internal-user-id': internalUserId }),
    },
  };
});

const mobileClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default mobileClient;
