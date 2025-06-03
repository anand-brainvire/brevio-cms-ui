import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { toast } from 'react-toastify';
import { Cross } from '@components/icons/icons';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import DecryptionFunction from '@services/decryption';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@config/constant';
import { Loader } from '@components/index';
import useStripePaymentInitilization from '@src/hooks/useStripePaymentInitilization';
import { PaymentCardProps } from '@type/payment';
import { useMutation } from '@apollo/client';
import { CREATE_SUBSCRIPTION } from '@framework/graphql/queries/subscription';
import { PaymentIntentResult, StripeError } from '@stripe/stripe-js';
const PaymentModal = ({ onClose, isModalShow, price, description, planId, planType }: PaymentCardProps) => {
	const { t } = useTranslation();
	const { getPaymentSecretKey } = useStripePaymentInitilization();
	const [createSubscription] = useMutation(CREATE_SUBSCRIPTION);
	const stripe = useStripe();
	const elements = useElements();
	const decryptedName = localStorage.getItem('profileName');
	const name = decryptedName && DecryptionFunction(decryptedName);
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const encryptedUserId = localStorage.getItem('loggedUserId');
	const userId = encryptedUserId && DecryptionFunction(encryptedUserId);
	const endDateFunction = (date: Date, planType: string): Date => {
		switch (planType) {
			case 'monthly':
				date.setMonth(date.getMonth() + 1);
				break;
			case 'quarterly':
				date.setMonth(date.getMonth() + 3);
				break;
			case 'yearly':
				date.setFullYear(date.getFullYear() + 1);
				break;
			default:
				throw new Error('Invalid plan type');
		}
		return date;
	};

	const handleStripeError = (error: StripeError) => {
		toast.error(error.message);
		setLoading(false);
	};

	const handlePaymentResult = async (result: PaymentIntentResult) => {
		if (result.error) {
			handleStripeError(result.error);
		} else {
			const paymentIntent = result.paymentIntent;
			const IncomingEndDate = new Date(paymentIntent.created);
			const endDate = endDateFunction(IncomingEndDate, planType);
			await createSubscription({
				variables: {
					userId: userId,
					planId: planId,
					paymentStatus: 1,
					stripeApiResponse: JSON.stringify(paymentIntent),
					startDate: new Date(paymentIntent.created),
					endDate: endDate,
					status: paymentIntent.status === 'succeeded' ? 1 : 0,
				},
			})
				.then((res) => {
					const data = res?.data;
					if (data?.createSubscription?.meta?.statusCode === 201) {
						setLoading(false);
						onClose();
						toast.success('Payment Successful');
						navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
					}
				})
				.catch(() => {
					setLoading(false);
					return toast.error('Payment Unsuccessful');
				});
		}
	};

	const handleSubmit = async () => {
		if (!price) {
			return;
		}

		const securePayment = getPaymentSecretKey('INR', price, description);
		securePayment.then(async (ele) => {
			setLoading(true);
			if (!stripe || !elements) {
				return;
			}
			const cardEle = elements.getElement('card');
			if (cardEle && ele?.paymentIntent?.client_secret) {
				const result = await stripe.confirmCardPayment(ele?.paymentIntent?.client_secret, {
					shipping: {
						name: name,
						address: {
							line1: '510 Townsend St',
							city: 'San Francisco',
							state: 'NJ',
							country: 'US',
						},
					},
					['payment_method']: {
						card: cardEle,
						['billing_details']: {
							name: name,
						},
					},
				});
				handlePaymentResult(result);
			}
		});
	};

	useEffect(() => {
		document.addEventListener('click', (event: globalThis.MouseEvent) => {
			if ((event.target as HTMLElement)?.id === 'addedit-role-model' || (event.target as HTMLElement)?.id === 'addedit-role-model-child') {
				onClose();
			}
		});
	}, [isModalShow]);

	return (
		<div id='addedit-role-model' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`model-container ${isModalShow ? '' : 'hidden'}`}>
			{loading && <Loader />}
			<div id='addedit-role-model-child' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={'model animate-fade-in '}>
				<div className=' model-content'>
					<div className='model-header'>
						<p className='text-lg font-medium text-white  '>Payment Modal</p>
						<Button onClick={onClose} title={t('Close') ?? ''}>
							<span className='mr-1 text-white w-2.5 h-2.5 inline-block svg-icon'>
								<Cross />
							</span>
						</Button>
					</div>
					<form>
						<div className='model-body'>
							<CardElement />
						</div>
						<div className='model-footer'>
							<Button className='btn-primary  ' disabled={!stripe} type='button' label={t('Pay')} onClick={handleSubmit} />

							<Button className='  hover:bg-gray-400 btn-gray ' onClick={onClose} label={t('Close')}></Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default PaymentModal;
