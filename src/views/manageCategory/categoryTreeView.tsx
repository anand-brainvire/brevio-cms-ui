import React, { useState, useEffect, useCallback, ReactElement } from 'react';
import { useQuery } from '@apollo/client';
import { FETCH_CATEGORY } from '@framework/graphql/queries/category';
import { useNavigate } from 'react-router-dom';
import { CategoryTreeDataArr, TreeNode } from '@type/category';
import Button from '@components/button/button';
import { DownIcon, EditIcon, PlayIcon, TreeViewIcon } from '@components/icons/icons';
import { ROUTES } from '@config/constant';
import { t } from 'i18next';
const App = (): ReactElement => {
	const [expandedNodes, setExpandedNodes] = useState<number[]>([]);
	const { data } = useQuery(FETCH_CATEGORY);
	const [categoryDrpData, setCategoryDrpData] = useState<TreeNode[]>([]);
	useEffect(() => {
		const parentData = [] as TreeNode[];

		const findChildren = (node: TreeNode, categories: CategoryTreeDataArr[]) => {
			const childCategories = categories.filter((category: CategoryTreeDataArr) => category.parent_category === node.key);

			childCategories.forEach((category: CategoryTreeDataArr) => {
				const childNode: TreeNode = {
					label: category.category_name,
					key: category.id,
					children: [],
				};
				if (node.children) {
					node?.children.push(childNode);
				}
				findChildren(childNode, categories);
			});
		};

		if (data?.fetchCategory) {
			const categories = data?.fetchCategory?.data?.Categorydata;
			const rootCategories = categories.filter((category: CategoryTreeDataArr) => category.parent_category === 0);
			rootCategories.forEach((category: CategoryTreeDataArr) => {
				const rootNode: TreeNode = {
					label: category.category_name,
					key: category.id,
					children: [],
				};
				parentData.push(rootNode);
				findChildren(rootNode, categories);
			});

			setCategoryDrpData(parentData);
		}
	}, [data]);

	const toggleNode = (nodeId: number) => {
		if (expandedNodes.includes(nodeId)) {
			setExpandedNodes(expandedNodes.filter((id) => id !== nodeId));
		} else {
			setExpandedNodes([...expandedNodes, nodeId]);
		}
	};

	const navigate = useNavigate();

	const handleNodeClick = (nodeId: number) => {
		// Redirect to the edit page based on the node ID
		navigate(`/app/category/edit/${nodeId}`);
	};
	const navigateHandler = useCallback(() => {
		return navigate(`/${ROUTES.app}/${ROUTES.category}/${ROUTES.list}`);
	}, []);
	const renderTreeNode = (node: TreeNode) => {
		const isExpanded = expandedNodes.includes(node.key);
		return (
			<div>
				<div>
					<div className='flex w-full p-2 mt-2 overflow-auto  border border-gray-300 rounded-sm bg-bg-5' key={node.key}>
						<div aria-label='toggle-node' aria-hidden='true' onClick={() => toggleNode(node.key)} className='flex w-full justify-between'>
							<div className='flex space-x-2'>
								{node.children && node.children.length > 0 && (
									<span className='mt-1 -ml-2'>
										{isExpanded ? (
											<span className='w-4 h-4 inline-block svg-icon'>
												<DownIcon />
											</span>
										) : (
											<span className='w-4 h-4 inline-block svg-icon'>
												<PlayIcon />
											</span>
										)}
									</span>
								)}
								<span className='text-base-font-1'>{node.label}</span>
							</div>

							<span aria-label='edit' aria-hidden='true' onClick={() => handleNodeClick(node.key)}>
								<EditIcon className='mt-1 text-red-800 leading-3 font-21px' />
							</span>
						</div>
					</div>
				</div>
				{isExpanded && node?.children && node?.children?.length > 0 && (
					<div className='flex w-wide-12 ml-1.5 pr-auto'>
						<div className='border-0 border-gray-300 border-b-2 border-l-2 h-rise-3 w-wide-2 right-0'></div>
						<div className='w-full'>{node?.children.map(renderTreeNode)}</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<div className='w-full md:w-1/2 overflow-auto bg-white border border-gray-200 rounded-sm shadow '>
			<div className='flex justify-end bg-bg-1 border-b border-b-color-4 px-5 py-3'>
				<Button onClick={navigateHandler} label={t('Go To Category List')} className='btn-primary ' type='button'>
					<span className='inline-block w-4 h-4 mr-1 svg-icon'>
						<TreeViewIcon />
					</span>
				</Button>
			</div>
			<div className='p-5'>{categoryDrpData.map(renderTreeNode)}</div>
		</div>
	);
};

export default App;
