import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { Cross } from '@components/icons/icons';
import TextInput from '@components/textinput/TextInput';
import { CREATE_BOOK } from '@framework/graphql/mutations/bookManagement';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import useValidation from '@src/hooks/validations';
import WithTranslateFormErrors from '@components/customHooks/useTranslationFormErrors';
import { Loader } from '@components/index';
import { BookInputType } from '@type/bookManagement';

interface AddBookModalProps {
	isVisible: boolean;
    onSubmitBook: () => void;
}

const CreateBook = ({ isVisible, onSubmitBook }: AddBookModalProps) => {
	const { t } = useTranslation();
	const [createBook, { loading }] = useMutation(CREATE_BOOK); // define mutation
	const { addBookValidationSchema } = useValidation(); // create book validation schema
	const initialValues: BookInputType = {
		bookName: '',
	};

	const formik = useFormik({
		initialValues,
		validationSchema: addBookValidationSchema,
		onSubmit: (values) => {
	    const input = {
	    	bookData: [
	    		{
	    			title: values.bookName,
	    			langCode: 'en',
	    		},
	    	],
	    };
    
	createBook({ variables: input })
		.then((res) => {
			const { data } = res;
			if (data?.createBook?.meta?.statusCode === 200 || data?.createBook?.meta?.statusCode === 201) {
				toast.success(data.createBook.meta.message);
                formik.resetForm();
                onSubmitBook();
			}
		})
		.catch(() => {
			return;
		});
    }
	});
	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if ((e.target as HTMLElement)?.id === 'add-book-modal') {
				onSubmitBook();
			}
		};
		document.addEventListener('click', handleOutsideClick);
		return () => document.removeEventListener('click', handleOutsideClick);
	}, [onSubmitBook]);

        /**
         * Method handles out side click
         */
        useEffect(() => {
            document.addEventListener('click', (event: globalThis.MouseEvent) => {
                if ((event.target as HTMLElement)?.id === 'addedit-role-model' || (event.target as HTMLElement)?.id === 'addedit-role-model-child') {
                    onSubmitBook();
                }
            });
        }, [isVisible]);
    
	return (
		<div id="add-book-modal" className={`model-container ${isVisible ? '' : 'hidden'}`}>
			{loading && <Loader />}
			<div className="model animate-fade-in">
				<div className="model-content">
					<div className="model-header">
						<p className="text-lg font-medium text-white">{t('Add New Book')}</p>
						<Button onClick={onSubmitBook}>
							<span className="text-white inline-block w-2.5 h-2.5 svg-icon">
								<Cross />
							</span>
						</Button>
					</div>
					<WithTranslateFormErrors errors={formik.errors} touched={formik.touched} setFieldTouched={formik.setFieldTouched}>
						<form onSubmit={formik.handleSubmit}>
							<div className="model-body">
								<TextInput
									id="bookName"
									name="bookName"
									placeholder={t('Book Title')}
									value={formik.values.bookName}
									onChange={formik.handleChange}
									error={formik.errors.bookName && formik.touched.bookName ? formik.errors.bookName : ''}
									label={t('Book Title')}
									required
								/>
								{/* Add more inputs like author, description etc. */}
							</div>
							<div className="model-footer">
								<Button type="submit" className="btn-primary" label={t('Submit')} />
								<Button onClick={onSubmitBook} className="btn-secondary" label={t('Close')} />
							</div>
						</form>
					</WithTranslateFormErrors>
				</div>
			</div>
		</div>
	);
};

export default CreateBook;
