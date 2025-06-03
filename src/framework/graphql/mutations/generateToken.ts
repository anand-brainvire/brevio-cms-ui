import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GENERATE_REFRESH_TOKEN = gql`
	${META_FRAGMENT}
	mutation GenerateRefreshToken($refreshToken: String) {
		generateRefreshToken(refreshToken: $refreshToken) {
			data {
				token
				expiresIn
				expiresAt
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
