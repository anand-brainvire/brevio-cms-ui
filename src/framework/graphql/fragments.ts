import { gql } from '@apollo/client';

export const META_FRAGMENT = gql`
	fragment MetaFragment on Meta {
		message
		messageCode
		statusCode
		status
		type
		errors {
			errorField
			error
		}
		errorType
	}
`;



export const IMAGE_FRAGMENT = gql`
fragment SettingsImageFragment on logoPath {
	original_file
	image_200
}`
export const BANNER_IMAGE_FRAGMENT = gql`
fragment BannerFragment on bannerPath {
	original_file
	image_200
}`