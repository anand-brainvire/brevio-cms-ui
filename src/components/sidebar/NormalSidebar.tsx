import { Home, AngleDownSidebar, AngleLeft } from '@components/icons/icons';
import RoleBaseGuard from '@components/roleGuard';
import { ROUTES, RedirectPages, SIDEBAR_NAVLINKS } from '@config/constant';
import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import DecryptionFunction from '@services/decryption';
import { SideBarProps } from '@type/component';
import { useTranslation } from 'react-i18next';
import { childRoutesLinksArray, sidebarNavlinksArray } from '@type/common';

const NormalSideBar = ({ show, menuHandler }: SideBarProps): ReactElement => {
	const { t } = useTranslation();
	const location = useLocation();
	const [screenSize, setScreenSize] = useState<{ width: number; height: number }>(getCurrentDimension());
	const [state, setState] = useState<boolean>(false);
	const [iconShower, setIconShower] = useState<boolean>(true);
	const sidebarRef = useRef<HTMLUListElement>(null);

	function getCurrentDimension() {
		return {
			width: window.innerWidth,
			height: window.innerHeight,
		};
	}

	const locationChangerNormalSidebar = useCallback(
		(Redirect: string, className: string) => {
			return location.pathname.includes(Redirect) ? `${className}` : '';
		},
		[location]
	);

	const colorChangerNormalSidebar = useCallback(
		(Redirect: string, className: string) => {
			return location.pathname.includes(Redirect) ? 'text-black' : `${className}`;
		},
		[location]
	);

	useEffect(() => {
		const updateDimensionNormalSidebar = () => {
			setScreenSize(getCurrentDimension());
		};
		window.addEventListener('resize', updateDimensionNormalSidebar);

		return () => {
			window.removeEventListener('resize', updateDimensionNormalSidebar);
		};
	}, [screenSize]);

	const mouseOverHandler = useCallback(() => {
		if (show && screenSize.width > 991) {
			setIconShower(true);
		}
	}, [screenSize.width, show]);

	const mouseLeaveHandler = useCallback(() => {
		if (show && screenSize.width > 991) {
			setIconShower(false);
			if (showTypeId !== '1') {
				setState(false);
			}
		}
	}, [screenSize.width, show]);

	useEffect(() => {
		if (screenSize.width < 991) {
			setIconShower(true);
		}
	}, [screenSize.width]);

	const encryptedShowTypeId = localStorage.getItem('sidebarShowType');
	const showTypeId = encryptedShowTypeId && DecryptionFunction(encryptedShowTypeId);

	useEffect(() => {
		const handleBodyClick = () => {
			if (getCurrentDimension().width < 640) {
				menuHandler((prev) => !prev);
			}
		};
		document.getElementById('aside')?.addEventListener('click', handleBodyClick);
		return () => {
			document.getElementById('aside')?.removeEventListener('click', handleBodyClick);
		};
	}, [show]);

	useEffect(() => {
		if (showTypeId == '1') {
			setState(true);
		}
	}, [showTypeId]);

	useEffect(() => {
		if (screenSize.width < 991) {
			// removing setToggleImage(false) as it's no longer needed
		}
		if (screenSize.width < 640 && !show) {
			menuHandler((prev) => !prev);
		}
	}, [screenSize]);

	const handleParentClick = () => {
		if (showTypeId == '1') {
			return;
		}
		setState((prev) => !prev);
	};

	const asideTogglerClasses = screenSize.width >= 1024 && showTypeId === '1' ? 'menu-horizontal lg:w-wide-3' : '';

	const asideCommonClasses = asideTogglerClasses + ' fixed sm:sticky h-full top-14 z-50 -ml-sidebar-space md:ml-0 bg-opacity-70 bg-black';

	const onIconShowHoverClasses = asideCommonClasses;

	const onShowerClasses = onIconShowHoverClasses + ' ' + (show ? 'w-wide-8 translate-x-0' : 'w-full sm:w-wide-8 md:w-0 !ml-0 md:!-ml-sidebar-space md:-translate-x-full');

	return (
		<div className={'flex flex-col justify-end show-menu'}>
			<aside id='aside' className={`${onShowerClasses} transition-all duration-300 md:overflow-y-auto md:overflow-x-hidden`}>
				<ul ref={sidebarRef} className={`w-full sidebar-li h-rise-8 sm:h-full ${show ? 'translate-x-0' : 'md:-translate-x-full'} fixed transition-all md:max-h-full overflow-y-hidden hover:overflow-y-auto bg-bg-4 box-border flex flex-col`}>
					<li className={'overflow-auto flex-auto show-sidebar-names'}>
						<ul
							aria-label='sidebar'
							aria-hidden='true'
							onMouseOver={mouseOverHandler}
							onMouseLeave={mouseLeaveHandler}
							onFocus={mouseOverHandler}
							onBlur={mouseLeaveHandler}
						>
							<li className='first:mt-2 box-border relative'>
								<NavLink
									to={ROUTES.dashboard}
									className={({ isActive }) =>
										`flex items-center justify-start font-normal h-11 px-4 py-3 text-sm 
										${isActive ? 'bg-primary text-black' : 'text-black hover:bg-primary hover:text-black'} 
										${locationChangerNormalSidebar(RedirectPages.dashBoard, 'bg-primary')}`
									}
								>
									{({ isActive }) => (
										<>
											<span className={`svg-icon flex items-center justify-center mr-3 h-3.5 w-3.5s ${colorChangerNormalSidebar(RedirectPages.dashBoard, isActive ? 'text-black' : 'text-base-font-1')}`}>
												<Home />
											</span>
											<span className='toggle-text-sidebar'>{t('Dashboard')}</span>
										</>
									)}
								</NavLink>
							</li>
							{SIDEBAR_NAVLINKS.map((listName: sidebarNavlinksArray) => (
								<li className='first:mt-2 box-border relative' key={listName.to}>
									{listName.childRoutes.length <= 0 && (
										<RoleBaseGuard permissions={listName.permissions}>
											<NavLink
												to={listName.to}
												className={({ isActive }) =>
													`flex items-center justify-start font-normal h-11 px-4 py-3 text-sm 
													${isActive ? 'bg-primary text-black' : 'text-black hover:bg-primary hover:text-black'} 
													${locationChangerNormalSidebar(listName.redirectPage, 'bg-primary')}`
												}
											>
												{({ isActive }) => (
													<>
														<span
															className={`svg-icon flex items-center justify-center mr-3 h-3.5 w-3.5 ${colorChangerNormalSidebar(listName.redirectPage, isActive ? 'text-black' : 'text-base-font-1')}`}
														>
															{listName.icon}
														</span>
														<span className='toggle-text-sidebar'>{t(`${listName.text}`)}</span>
													</>
												)}
											</NavLink>
										</RoleBaseGuard>
									)}
									{listName.childRoutes.length > 0 && (
										<ul>
											<li key={listName.text}>
												<ul>
													<RoleBaseGuard permissions={listName.permissions}>
														<li aria-label='open-close' aria-hidden='true' className='flex items-center font-normal h-11 px-4 py-3 text-sm text-black hover:bg-primary cursor-pointer relative sub-menu-active' onClick={handleParentClick}>
															<span className='svg-icon inline-block mr-3 h-3.5 w-3.5 text-base-font-1'>{listName.icon}</span>
															<span className='text-sm'>
																<span className='toggle-text-sidebar'>{t(`${listName.text}`)}</span>
															</span>
															{state ? (
																<span className={`ml-5 angle-down inline-block svg-icon ${iconShower ? '' : 'hidden'}`}>
																	<AngleDownSidebar />
																</span>
															) : (
																<span className={`ml-5 angle-down inline-block svg-icon ${iconShower ? '' : 'hidden'}`}>
																	<AngleLeft />
																</span>
															)}
														</li>
													</RoleBaseGuard>
												</ul>
												{state && showTypeId !== '1' && (
													<ul>
														{listName.childRoutes.map((child: childRoutesLinksArray) => (
															<RoleBaseGuard permissions={child.permissions} key={child.text}>
																<li className='sub-list'>
																	<NavLink to={child.to} className={`flex items-center font-normal h-11 bg-bg-4 px-3 py-3 box-border text-sm text-black hover:bg-primary [.menu-horizontal_&]:bg-light-black ${locationChangerNormalSidebar(child.redirectPage, 'bg-primary')}`}>
																		<span className={`${colorChangerNormalSidebar(child.redirectPage, 'text-base-font-1')} mr-3 !w-wide-1 !h-auto ml-4 svg-icon`}>{child.icon}</span>
																		<span className='toggle-text-sidebar'>{t(`${child.text}`)}</span>
																	</NavLink>
																</li>
															</RoleBaseGuard>
														))}
													</ul>
												)}
											</li>
										</ul>
									)}
								</li>
							))}
						</ul>
					</li>
				</ul>
			</aside>
		</div>
	);
};

export default React.memo(NormalSideBar);
