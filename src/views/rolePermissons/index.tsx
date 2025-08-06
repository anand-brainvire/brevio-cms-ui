import { useMutation, useQuery } from '@apollo/client';
import Button from '@components/button/button';
import Dropdown from '@components/dropdown/dropDown';
import { Compress, Expand, CheckCircle, Folder } from '@components/icons/icons';
import { RoleDataArr } from '@framework/graphql/graphql';
import { CREARTE_ROLE_PERMISSIONS } from '@framework/graphql/mutations/rolePermission';
import { GET_ROLES_DATALIST } from '@framework/graphql/queries/role';
import { GET_PERMISSIONS, FETCH_ROLE_PERMISSIONS_BY_ID } from '@framework/graphql/queries/rolePermissions';
import RolePermission from '@views/role';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { DropdownOptionType } from '@type/component';
import { ChildListType, ModuleListType, RolePermissionsProps } from '@type/rolePermissions';
import { Tree, TreeCheckboxSelectionKeys, TreeExpandedEvent, TreeExpandedKeysType, TreeSelectionEvent } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';

import { translationFun } from '@utils/helpers';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';
import { Loader } from '@components/index';
import { IS_ALL } from '@config/constant';

const iconFun = (node: TreeNode): React.ReactNode => (
	<div className='m-0 flex items-center'>
		<span className='inline-block w-3.5 h-3.5 text-gray-800  mx-1 svg-icon'>
			<Folder />
		</span>
		<span>{node.label}</span>
	</div>
);
const RolePermissions = () => {
	const [selectedKeys, setSelectedKeys] = useState<TreeCheckboxSelectionKeys>({ '46d61fe6-c2bb-4218-84e9-ac00016d5c64': { checked: true, partialChecked: false } });
	const { t } = useTranslation();
	const { data } = useQuery(GET_PERMISSIONS);
	const { data: roleData, refetch: refetchRoleData } = useQuery(GET_ROLES_DATALIST, { variables: { isAll: IS_ALL, sortOrder: 'asc', sortBy: 'role_name' }, fetchPolicy: 'network-only' });
	const { refetch: getRolePermissionListById } = useQuery(FETCH_ROLE_PERMISSIONS_BY_ID, { skip: true, fetchPolicy: 'network-only' });
	const [createRolePermissions, { loading: createLoader }] = useMutation(CREARTE_ROLE_PERMISSIONS);
	const [roleDrpData, setRoleDrpData] = useState<DropdownOptionType[]>([]);
	const [filterRoleData, setFilterRoleData] = useState<RolePermissionsProps>({
		roleId: null,
	});
	const [toggleExpand, setToggleExpand] = useState<boolean>(false);
	const [allCheckboxState, setAllCheckboxState] = useState<boolean>(false);
	const [expandedKeys, setExpandedKeys] = useState<TreeExpandedKeysType>({});
	const [nodes, setNodes] = useState<TreeNode[]>([]);
	const [checkedInt, setCheckedInt] = useState<string[]>([]);

	/** Sets the nodes List to treeview */
	
	useEffect(() => {
		if (data?.fetchPermissions?.data) {
			setNodes(
				data.fetchPermissions.data.map((module: ModuleListType) => ({
					key: module.id,
					data: module.id,
					label: module.module_name,
					children: module.permissions.length ? nodeMaker(module.permissions) : [],
				}))
			);
		}
	}, [data?.fetchPermissions?.data]);

	/** after availabe of nodes list it expands all the parent nodes */
	useEffect(() => {
		if (nodes.length) {
			ExpandCompressHandler();
		}
	}, [nodes]);

	/** once the roles data is availabe it provides the data to dropdown  */
	useEffect(() => {
		if (roleData?.roles?.data) {
			const tempDataArr: DropdownOptionType[] = [];
			roleData.roles.data.rolesData.forEach((data: RoleDataArr) => {
				tempDataArr.push({ name: data.role_name, key: data.uuid });
			});
			setRoleDrpData(tempDataArr);
		}
	}, [roleData?.roles]);
	
	/** function used to check and uncheck all nodes in treeview  */
	const AllCheckBoxHandler = () => {
		if (!allCheckboxState && data?.fetchPermissions?.data) {
			const allChecked: TreeCheckboxSelectionKeys = {};
			data.fetchPermissions.data.forEach((module: ModuleListType) => {
				// Check parent node (module)
				allChecked[module.id] = { checked: true, partialChecked: false };
				// Check all child permissions
				module.permissions.forEach((perm) => {
					allChecked[perm.uuid] = { checked: true, partialChecked: false };
				});
			});
			setSelectedKeys(allChecked);
		} else {
			setSelectedKeys({});
		}
	};

	/**
	 * @param value it use to fetch permissions seleted in dropdown
	 */

	const getRolePermission = useCallback(
		(value: string) => {
			if (value) {
				getRolePermissionListById({ uuid: value })
					.then((res) => {
						const permissions = res?.data?.role?.data?.permissions || [];
						let checkedPermissions: TreeCheckboxSelectionKeys = {};
						permissions.forEach((perm: { uuid: string | number }) => {
							checkedPermissions[perm.uuid] = { checked: true, partialChecked: false };
						});
						// Update parent nodes
						checkedPermissions = updateParentNodes(checkedPermissions);
						setSelectedKeys(checkedPermissions);
					})
					.catch((err) => toast.error(err));
			}
		},
		[]
	);

	/** Select role drop down change handler */
	const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedRoleId = e.target.value;
		setFilterRoleData({ roleId: selectedRoleId });

		if (selectedRoleId) {
			getRolePermission(selectedRoleId);
		} else {
			// No role selected: clear checked permissions and reload all permissions
			setSelectedKeys({});
			// Optionally, you can refetch permissions if needed:
			// refetchPermissions(); // Uncomment if you want to force refetch
		}
	}, [getRolePermission]);
	/** function that check the childern availabe or not and added it to expanded keys  */
	const expandNode = (node: TreeNode, _expandedKeys: TreeExpandedKeysType) => {
		if (node?.children?.length) {
			_expandedKeys[translationFun(node.key as string)] = true;

			for (const child of node.children) {
				expandNode(child, _expandedKeys);
			}
		}
	};

	/** Function handles the expanion of tree view */
	const ExpandCompressHandler = useCallback(() => {
		const _expandedKeys = {};

		for (const nod of nodes) {
			expandNode(nod, _expandedKeys);
		}
		setExpandedKeys(_expandedKeys);
		setToggleExpand(true);
	}, [expandNode, expandedKeys, toggleExpand]);

	/** function that handles the compression of treeview */
	const collapseAll = useCallback(() => {
		setExpandedKeys({});
		setToggleExpand(false);
	}, [expandedKeys, toggleExpand]);

	const nodeList = useRef<{ [key: number | string]: { list: string[] } }>({});

	/** function that adds the children to parent */
	const nodeMaker = (data: ChildListType[]): object => {
		return data.map((mappedNodeMakerData: ChildListType) => {
			if (Object.keys(nodeList.current).includes(JSON.stringify(mappedNodeMakerData.module_id))) {
				nodeList.current[mappedNodeMakerData.module_id]['list'] = [...nodeList.current[mappedNodeMakerData.module_id]['list'], mappedNodeMakerData.uuid];
			} else {
				nodeList.current[mappedNodeMakerData.module_id] = { list: [mappedNodeMakerData.uuid] };
			}
			return { key: mappedNodeMakerData.uuid, data: mappedNodeMakerData.module_id, label: mappedNodeMakerData.permission_name };
		});
	};
	/** handles the all check box based on selected keys it checks and unchecks the all checkbox */
	useEffect(() => {
		const dummy: string[] = [];
		if (selectedKeys !== null) {
			Object.keys(selectedKeys)?.forEach((singleSelectedKey: string) => {
				if (singleSelectedKey.length === 36) {
					dummy.push(singleSelectedKey);
				}
			});

			setCheckedInt(dummy);
		}
		let lengthReq;
		if (nodes) {
			lengthReq =
				nodes?.length +
				nodes?.reduce((acc, num) => {
					const reqNum = num?.children ? num?.children?.length : 0;
					return acc + reqNum;
				}, 0);
		}

		if (Object.keys(selectedKeys).length === lengthReq && lengthReq) {
			setAllCheckboxState(true);
		}

		if (Object.keys(selectedKeys).length !== lengthReq) {
			setAllCheckboxState(false);
		}
	}, [selectedKeys]);

	/**
	 * Method used create the role premissions
	 */
	const saveRolePermissionsHandler = useCallback(() => {
		if (filterRoleData.roleId !== null) {
			createRolePermissions({
				variables: {
					roleUuid: filterRoleData.roleId,
					permissionUuids: checkedInt,
				},
			})
				.then((res) => {
					const meta = res?.data?.updateRolePermissions?.meta;
					if (meta) {
						if (meta.statusCode === 200) {
							toast.success(meta.message);
						} else {
							toast.error(meta.message || t('Something went wrong'));
						}
					}
				})
				.catch(() => {
					return;
				});
		}
	}, [filterRoleData.roleId, checkedInt, t]);

	/** function that handles single node to expand and compress */
	const onToggle = useCallback((event: TreeExpandedEvent) => {
		setExpandedKeys(event.value);
	}, []);
	/** function added single checked nodes to selected keys  */
	const onSelectionChange = useCallback((event: TreeSelectionEvent) => {
		setSelectedKeys(event.value as TreeCheckboxSelectionKeys);
	}, []);

	const updateParentNodes = (checkedPermissions: TreeCheckboxSelectionKeys) => {
		Object.keys(nodeList.current).forEach((moduleId) => {
			const allChildren = nodeList.current[moduleId].list;
			const allChecked = allChildren.every((uuid) => checkedPermissions[uuid]?.checked);
			const someChecked = allChildren.some((uuid) => checkedPermissions[uuid]?.checked);

			if (allChecked && allChildren.length > 0) {
				checkedPermissions[moduleId] = { checked: true, partialChecked: false };
			} else if (someChecked) {
				checkedPermissions[moduleId] = { checked: false, partialChecked: true };
			} else {
				delete checkedPermissions[moduleId];
			}
		});
		return checkedPermissions;
	};

	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-x-8 '>
			{createLoader && <Loader />}
			<RoleBaseGuard permissions={[PERMISSION_LIST.Permission.ListAccess]}>
				<div className='w-full h-full '>
					<div className='card'>
						<div className='card-header '>
							<Dropdown placeholder={t('Select role')} name='role' value={filterRoleData.roleId ? filterRoleData.roleId : ''} onChange={handleChange} options={roleDrpData} id='role' />
							<div>
								<RoleBaseGuard permissions={[PERMISSION_LIST.Permission.createAccess]}>
									<Button className='btn-primary ' label={t('Save')} onClick={saveRolePermissionsHandler}>
										<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
											<CheckCircle />
										</span>
									</Button>
								</RoleBaseGuard>
							</div>
						</div>
						<div className='card-body  h-full'>
							<div className='flex flex-row items-center justify-between'>
								<div>
									<input id='allCheck' type='checkbox' className='checkbox mr-2 w-3 h-3' checked={allCheckboxState} onChange={AllCheckBoxHandler} />
									<label htmlFor='allCheck' className='text-md text-gray-500'>
										{t('All')}
									</label>
								</div>
								{toggleExpand ? (
									<span className='w-3 h-3.5 inline-block svg-icon'>
										<Compress onClick={collapseAll} />
									</span>
								) : (
									<span className='w-3 h-3.5 inline-block svg-icon'>
										<Expand onClick={ExpandCompressHandler} />
									</span>
								)}
							</div>

							<hr className='w-full my-2'></hr>
							<div className={' overflow-auto '}>
								<Tree value={nodes} selectionMode='checkbox' selectionKeys={selectedKeys} onSelectionChange={onSelectionChange} onToggle={onToggle} expandedKeys={expandedKeys} nodeTemplate={iconFun} />
							</div>
						</div>
					</div>
				</div>
			</RoleBaseGuard>
			<RoleBaseGuard permissions={[PERMISSION_LIST.Role.ListAccess]}>
				<div className='w-full h-auto  '>
					<RolePermission getRolePermission={getRolePermission} setDropDownData={setFilterRoleData} refetchRoleData={refetchRoleData} />
				</div>
			</RoleBaseGuard>
		</div>
	);
};
export default RolePermissions;
