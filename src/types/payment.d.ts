export type PaymentCardProps = {
	onClose: () => void;
	isModalShow: boolean;
	price: number | undefined;
	description: string;
	planId: number | undefined;
	planType: string;
};

export type PaymentIntentProps = {
	paymentIntent: {
		client_secret: string | null;
	};
};
