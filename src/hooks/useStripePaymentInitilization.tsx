import Stripe from 'stripe';
const useStripePaymentInitilization = () => {
	const secretKey = process.env.REACT_APP_SECRET_KEY as string;
	const stripe = new Stripe(secretKey);
	const getPaymentSecretKey = async (currency: string, amount: number, description: string) => {
		const paymentIntent = await stripe.paymentIntents.create({
			amount: amount * 100,
			currency: currency ?? 'INR',
			description: description,
			['payment_method']: 'pm_card_visa',
		});
		return { paymentIntent: paymentIntent };
	};
	return {
		getPaymentSecretKey,
	};
};

export default useStripePaymentInitilization;
