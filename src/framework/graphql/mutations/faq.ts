import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const UPDATE_FAQ_STATUS = gql`
	${META_FRAGMENT}
	mutation ChangeFaqStatus($changeFaqStatusId: UUID, $status: Int) {
		changeFaqStatus(uuid: $changeFaqStatusId, status: $status) {
			data {
				id
				topic_id
				question_english
				question_arabic
				question_hindi
				answer_english
				answer_arabic
				answer_hindi
				status
				createdAt
				updatedAt
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const DELETE_FAQ = gql`
	${META_FRAGMENT}
	mutation DeleteFaq($deleteFaqId: UUID) {
		deleteFaq(uuid: $deleteFaqId) {
			meta {
				...MetaFragment
			}
		}
	}
`;

export const UPDATE_FAQ_DATA = gql`
	${META_FRAGMENT}
	mutation Mutation($updateFaqId: UUID, $topicId: Int, $questionArabic: String, $questionEnglish: String, $questionHindi: String, $answerEnglish: String, $answerArabic: String, $answerHindi: String, $status: Int) {
		updateFaq(uuid: $updateFaqId, topic_id: $topicId, question_arabic: $questionArabic, question_english: $questionEnglish, question_hindi: $questionHindi, answer_english: $answerEnglish, answer_arabic: $answerArabic, answer_hindi: $answerHindi, status: $status) {
			data {
				id
				topic_id
				question_english
				question_arabic
				question_hindi
				answer_english
				answer_arabic
				answer_hindi
				status
				createdAt
				updatedAt
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
export const CREATE_FAQ_MUTATION = gql`
	${META_FRAGMENT}
	mutation CreateFaq($topicId: Int, $questionEnglish: String, $questionArabic: String, $questionHindi: String, $answerEnglish: String, $answerArabic: String, $answerHindi: String, $status: Int) {
		createFaq(topic_id: $topicId, question_english: $questionEnglish, question_arabic: $questionArabic, question_hindi: $questionHindi, answer_english: $answerEnglish, answer_arabic: $answerArabic, answer_hindi: $answerHindi, status: $status) {
			data {
				id
				topic_id
				question_english
				question_arabic
				question_hindi
				answer_english
				answer_arabic
				answer_hindi
				status
				createdAt
				updatedAt
			}
			meta {
				...MetaFragment
			}
		}
	}
`;

export const GRP_DEL_FAQ = gql`
	${META_FRAGMENT}
	mutation GroupDeleteFaqs($groupDeleteFaqsId: [UUID]) {
		groupDeleteFaqs(uuid: $groupDeleteFaqsId) {
			meta {
				...MetaFragment
			}
		}
	}
`;
