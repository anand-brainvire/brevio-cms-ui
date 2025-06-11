import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { AccesibilityNames, LANGUAGE_DROPDOWN_LIST, PROFILE_DROPDOWN_LIST } from '@config/constant';
import { Link } from 'react-router-dom';
import defaultUser from '@assets/images/default-user-image.png';
import defaultLogoLarge from '@assets/images/brevio-logo.png';
import defaultLogoSmall from '@assets/images/icon-72x72.png';
import { HamburgerMenu } from '@components/icons/icons';
import { HeaderProps } from '@type/component';
import i18n from 'src/i18n';
import DecryptionFunction from '@services/decryption';
import useClickOutside from '@components/customHooks/useClickoutside';
import DropDownProfileAndLanguage from '@components/common/dropdownProfile&Language';

const Header = ({ onClick, logoutConformation, toggleHeaderImage }: HeaderProps): ReactElement => {
	const [isShowProfileModel, setIsShowProfileModel] = useState<boolean>(false);
	const [isShowLanguageModel, setIsShowLanguageModel] = useState<boolean>(false);
	const [profileNameList, setProfileNameList] = useState<string | null>();
	const [profileLastName, setProfileLastName] = useState<string | null>();
	// const [logo] = useState<string>('');
	/**
	 * function that handle's profile dropdown open and close
	 */
	const ProfileModelHandler = useCallback(() => {
		setIsShowLanguageModel(false);
		setIsShowProfileModel((prev) => !prev);
	}, [isShowLanguageModel, isShowProfileModel]);
	/**
	 * Function that closes profile drop-down and open respestive modules .
	 * @param type is defines 'profile' or 'logout' .
	 * if type is 'profile' it redirects to profile page .
	 * if type is 'logout; it enables logout popup.
	 * @returns function base on profile type or logout type.
	 */
	const profileHandlerObject = (type: string): void => {
		const profileData: { [key: string]: () => void } = {
			['profile']: () => {
				setIsShowProfileModel(false);
			},
			['Logout']: () => {
				logoutConformation(true);
			},
		};
		return profileData[type]();
	};

	const ProfileHandler = useCallback((data: string | undefined | null): void => {
		data && profileHandlerObject(data);
	}, []);

	const updateProfileName = () => {
		const encryptedNewProfileName = localStorage.getItem('valueslist');
		const newProfileName = encryptedNewProfileName && DecryptionFunction(encryptedNewProfileName);
		const encryptedNewProfilelastname = localStorage.getItem('valueslistlastname');
		const newProfilelastname = encryptedNewProfilelastname && DecryptionFunction(encryptedNewProfilelastname);
		setProfileNameList(newProfileName);
		setProfileLastName(newProfilelastname);
	};

	useEffect(() => {
		updateProfileName();
		const intervalId = setInterval(updateProfileName, 1000);
		return () => clearInterval(intervalId);
	}, []);
	const encryptedProfileName = localStorage.getItem('profileName') as string;
	const initailvalue = encryptedProfileName && DecryptionFunction(encryptedProfileName);
	/**
	 * function that handle's language dropdown open and close
	 */
	// const languageHandler = useCallback(() => {
	// 	setIsShowProfileModel(false);
	// 	setIsShowLanguageModel((prev) => !prev);
	// }, [setIsShowLanguageModel, setIsShowProfileModel]);

	const OnClickHandler = useCallback(() => {
		onClick((prev) => !prev);
	}, []);

	useClickOutside(['model-lan'], setIsShowLanguageModel, isShowLanguageModel);
	useClickOutside(['model-prof'], setIsShowProfileModel, isShowProfileModel);
	/**
	 * function that chnages the language based on user selection in language dropdown.
	 */
	const languageChangeHandler = useCallback((data: string | null | undefined): void => {
		data && i18n.changeLanguage(data);
	}, []);

	return (
		<header className='bg-white z-10 h-14 border-b border-b-color-4 flex'>
			<nav className=' flex items-center w-full' aria-label='Global'>
				<div aria-label='hamburger' aria-hidden='true' id='hamburger' onClick={OnClickHandler} className='flex justify-center items-center lg:hidden  border border-transparent w-12 h-14 m-auto '>
					<span className='hover:cursor-pointer [&_path]:stroke-base-font-1 [&_path]:hover:stroke-bg-4 h-6 w-23px inline-block svg-icon'>
						<HamburgerMenu />
					</span>
				</div>
				<Link to='/' className='w-wide-7 h-14 flex flex-1 items-center lg:flex-initial justify-end lg:justify-center'>
					{/* Always use defaultLogoLarge or defaultLogoSmall */}
					{!toggleHeaderImage ? (
						<img className='h-10 w-wide-10 object-contain ' src={defaultLogoLarge} alt='LogoImage' />
					) : (
						<img className='h-rise-3 w-wide-2 object-contain ' src={defaultLogoSmall} alt='LogoImage' />
					)}
				</Link>
				{/* <div aria-label='hamburger' aria-hidden='true' id='hamburger' onClick={OnClickHandler} className='[&_path]:stroke-base-font-1 [&_path]:hover:stroke-bg-4 hidden hover:cursor-pointer lg:flex justify-center items-center w-12 h-14'>
					<span className='w-6 h-6 inline-block svg-icon'>
						<HamburgerMenu />
					</span>
				</div> */}
				{/* <ul className='hidden lg:flex items-center justify-center'>
					<li className='px-4'>
						<Link to={`/${ROUTES.app}/${ROUTES.settings}`} className=' font-normal text-sm h-5 text-slate-500'>
							{t('Settings')}
						</Link>
					</li>
				</ul> */}
				<ul className='flex flex-1 items-center justify-end ml-auto'>
					<li className='relative cursor-pointer px-4 '>
						{/* <Link to='#' className='text-sm text-gray-600 uppercase' id='model-lan' onClick={languageHandler}>
							{i18n.language.split('-')[0]}
						</Link> */}
						{isShowLanguageModel && <DropDownProfileAndLanguage onClick={languageChangeHandler} List={LANGUAGE_DROPDOWN_LIST} className='text-primary' />}
					</li>
					<li className='hidden sm:block'>
						<p className='font-normal text-sm'>
							{profileNameList ?? initailvalue} <span> {profileLastName}</span>
						</p>
					</li>
					<li className='relative'>
						<Link aria-label={AccesibilityNames.profile} to='#' onClick={ProfileModelHandler}>
							<img className=' h-9 mx-2.5 rounded-full cursor-pointer' id='model-prof' src={defaultUser} alt='' />
						</Link>
						{isShowProfileModel && <DropDownProfileAndLanguage onClick={ProfileHandler} List={PROFILE_DROPDOWN_LIST} className='text-dark-gary-2' />}
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
