export type FaqChangeProps = {
	onClose: () => void;
	changeFaqStatus: () => void;
};

export type FaqDeleteProps = {
	onClose: () => void;
	deleteFaqData: () => void;
};
export type RoleEditProps = {
	isRoleModelShow: boolean;
	onHandleChange?: React.ChangeEventHandler<HTMLInputElement>;
	onSubmitRole: () => void;
	onClose?: () => void;
	roleVal: string;
	isRoleEditable: boolean;
	roleObj: roleData;
};
export type FaqTopicData = {
	fetchFaqTopics: {
		data: {
			faqTopicData: FaqTopicDataArr[];
		};
	};
};

export type FaqTopicDataArr = {
	id: number;
	name: string;
};

export type CreateFaq = {
	topicId: string;
	questionEnglish: string;
	questionArabic: string;
	questionHindi: string;
	answerEnglish: string;
	answerArabic: string;
	answerHindi: string;
	status: number;
};
