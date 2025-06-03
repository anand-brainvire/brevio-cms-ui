
import React, { useCallback } from 'react';
import Button from '@components/button/button';
import { TreeViewIcon } from '@components/icons/icons';
import { ROUTES } from '@config/constant';
import { useNavigate } from 'react-router-dom';
import { TreeRouteComponentProps } from '@type/common';

const TreePageBtn = ({ route }: TreeRouteComponentProps) => {
	const navigate = useNavigate();

	const editRedirection = useCallback(() => {
		navigate(`/${ROUTES.app}/${route}/treeView`);
	}, [ROUTES]);

	return (
		<Button className='btn-primary  ' onClick={editRedirection} label={'Category Tree View'}>
			<span className='w-4 h-4 inline-block mr-1 svg-icon'>
				<TreeViewIcon />
			</span>
		</Button>
	);
};
export default TreePageBtn;
