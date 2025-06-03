import { SideBarProps } from '@type/component';
import NormalSidebar from '@components/sidebar/NormalSidebar';
import React, { ReactElement } from 'react';
const Sidebar = ({ show, menuHandler, setToggleImage }: SideBarProps): ReactElement => {
	return <NormalSidebar show={show} menuHandler={menuHandler} setToggleImage={setToggleImage} />;
};

export default React.memo(Sidebar);
