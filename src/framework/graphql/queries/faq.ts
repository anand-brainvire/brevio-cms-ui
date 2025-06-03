import { gql } from '@apollo/client';
import { META_FRAGMENT } from '@framework/graphql/fragments';

export const GET_FAQS_DATA = gql`
${META_FRAGMENT}
query FetchFaqs($page: Int, $limit: Int, $search: String, $sortBy: String, $sortOrder: String) {
	fetchFaqs(page: $page, limit: $limit, search: $search, sortBy: $sortBy, sortOrder: $sortOrder) {
	  data {
		faqData {
		  id
		  uuid
		  topic_id
		  question_english
		  question_arabic
		  question_hindi
		  answer_english
		  answer_arabic
		  answer_hindi
		  status
		  faq_topic {
			id
			uuid
			name
			createdAt
			updatedAt
		  }
		  createdAt
		  updatedAt
		}
		count
	  }
	  meta {
		...MetaFragment
	}
}
}
`

export const GET_FETCHTOPICS_DATA = gql`
	${META_FRAGMENT}
	query FaqTopics {
		faqTopics {
			data {
				id
				name
				createdAt
				updatedAt
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GET_FAQBYID_DATA = gql`
	${META_FRAGMENT}
	query GetFaq($faqId: UUID) {
		getFaq(uuid: $faqId) {
			data {
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
				uuid
			}
			meta {
				...MetaFragment
			}
		}
	}
`;
export const GET_FAQ_TOPICS_BY_ID = gql`
	${META_FRAGMENT}
	query FaqTopic($faqTopicId: Int) {
		faqTopic(id: $faqTopicId) {
			data {
				id
				name
				createdAt
				updatedAt
			}
			meta {
				...MetaFragment
			}
		}
	}
`;


export const GET_FAQ_TOPICS = gql`
${META_FRAGMENT}
query FetchFaqTopics($isAll: Boolean) {
	fetchFaqTopics(is_all: $isAll) {
	  data {
		faqTopicData {
		  id
		  uuid
		  name
		  createdAt
		  updatedAt
		}
		count
	  }
	  meta {
		...MetaFragment
	  }
	}
  }
`;
