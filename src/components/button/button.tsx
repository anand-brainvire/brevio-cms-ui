import { ROUTES } from '@config/constant';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonProps, OptionsPropsForButton } from '@type/component';
import { useTranslation } from 'react-i18next';

const Button = ({ id, label, onClick, type = 'button', className, children, disabled = false, route, data, icon, spanClassName = 'svg-icon inline-block h-3.5 w-3.5', title }: ButtonProps) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const buttonClickFun = () => {
		const options: OptionsPropsForButton = {
			route: route,
			data: data,
			navigateRoute: () => {
				return navigate(`/${ROUTES.app}/${route}/${ROUTES.edit}/${data?.uuid}`);
			},
			viewNavigateRoute: () => {
				return navigate(`/${ROUTES.app}/${route}/${ROUTES.view}/${data.uuid}`);
			},
		};
		if (onClick) {
			onClick(options);
		}
	};

	return (
		<button aria-label={title} title={title && t(title).toString()} id={id} className={`btn ${className ?? ''}`} type={type} onClick={buttonClickFun} disabled={disabled}>
			{children}
			{label}
			{icon && <span className={spanClassName}>{icon}</span>}
		</button>
	);
};

export default React.memo(Button);
